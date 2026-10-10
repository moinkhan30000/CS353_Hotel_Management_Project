import base64
import os
import re
import unittest
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("E2E_BASE_URL", "http://localhost:5173").rstrip("/")
ARTIFACTS = Path(__file__).parent / "artifacts"

ACCOUNTS = {
    "guest": ("guest@hotel.test", "Guest123!"),
    "manager": ("manager@hotel.test", "Manager123!"),
    "admin": ("admin@hotel.test", "Admin123!"),
}

PUBLIC_ROUTES = {
    "home": "/",
    "login": "/login",
    "register": "/register",
    "guest_registration": "/register/guest",
    "manager_registration": "/register/manager",
    "properties": "/properties",
    "contact": "/contact",
    "forgot_password": "/forgot-password",
}

ROLE_ROUTES = {
    "guest": {
        "dashboard": "/guest-dashboard",
        "profile": "/guest-profile",
        "reservations": "/reservation-history",
        "payments": "/payment-history",
        "wallet": "/guest-topup",
        "reviews": "/guest-reviews",
    },
    "manager": {
        "dashboard": "/managerhoteldashboard",
        "profile": "/managerprofile",
        "bookings": "/manage-bookings",
        "rooms": "/rooms",
        "images": "/edit-hotel-images",
        "reviews": "/reviews",
    },
    "admin": {
        "dashboard": "/admindashboard",
        "profile": "/admindashboard/profile",
        "reports": "/admindashboard/reports",
    },
}

VIEWPORTS = {
    "desktop": (1440, 1000),
    "mobile": (390, 844),
}


class HorizonStayVisualTests(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        options.add_argument("--disable-search-engine-choice-screen")
        options.add_argument("--no-default-browser-check")
        options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(*VIEWPORTS["desktop"])
        self.wait = WebDriverWait(self.driver, 12)
        self.driver.get(BASE_URL)
        self.driver.execute_script("window.localStorage.clear();")
        ARTIFACTS.mkdir(parents=True, exist_ok=True)

    def tearDown(self):
        self.driver.quit()

    def open(self, path):
        self.driver.get(f"{BASE_URL}{path}")
        self.wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

    def login(self, role):
        email, password = ACCOUNTS[role]
        self.open(f"/login/{role}")
        self.wait.until(EC.visibility_of_element_located((By.ID, "login-email"))).send_keys(email)
        password_input = self.driver.find_element(By.ID, "login-password")
        password_input.send_keys(password)
        password_input.send_keys(Keys.ENTER)
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".private-nav")))

    def capture_full_page(self, filename):
        result = self.driver.execute_cdp_cmd("Page.captureScreenshot", {
            "format": "png",
            "captureBeyondViewport": True,
            "fromSurface": True,
        })
        (ARTIFACTS / filename).write_bytes(base64.b64decode(result["data"]))

    def verify_page(self, name, authenticated=False):
        self.wait.until(lambda driver: len(driver.find_element(By.TAG_NAME, "body").text.strip()) > 0)
        self.wait.until(lambda driver: "Loading profile..." not in driver.find_element(By.TAG_NAME, "body").text)
        body_text = self.driver.find_element(By.TAG_NAME, "body").text
        self.assertNotIn("Page not found", body_text, name)
        self.assertNotIn("Something went wrong", body_text, name)

        if authenticated:
            visible_headers = [item for item in self.driver.find_elements(By.CSS_SELECTOR, ".private-nav") if item.is_displayed()]
            self.assertEqual(len(visible_headers), 1, f"{name} should have one visible authenticated header")

        layout = self.driver.execute_script("""
            return {
                viewport: document.documentElement.clientWidth,
                page: document.documentElement.scrollWidth,
                body: document.body.scrollWidth,
                card: document.querySelector('.card-details-row') ? {
                    display: getComputedStyle(document.querySelector('.card-details-row')).display,
                    columns: getComputedStyle(document.querySelector('.card-details-row')).gridTemplateColumns,
                    width: document.querySelector('.card-details-row').getBoundingClientRect().width
                } : null,
                offenders: [...document.querySelectorAll('body *')]
                    .filter(element => {
                        const box = element.getBoundingClientRect();
                        return box.right > document.documentElement.clientWidth + 3 || box.left < -3;
                    })
                    .slice(0, 8)
                    .map(element => `${element.tagName.toLowerCase()}.${element.className} (${Math.round(element.getBoundingClientRect().left)}..${Math.round(element.getBoundingClientRect().right)})`)
            };
        """)
        overflow = max(layout["page"], layout["body"]) - layout["viewport"]
        self.assertLessEqual(overflow, 3, f"{name} has {overflow}px horizontal overflow: {layout['offenders']}; card={layout['card']}; viewport={layout['viewport']}")

        serious_logs = []
        for entry in self.driver.get_log("browser"):
            message = entry.get("message", "")
            if entry.get("level") == "SEVERE" and not re.search(r"favicon|Failed to load resource.*404", message):
                serious_logs.append(message)
        self.assertFalse(serious_logs, f"{name} browser errors: {serious_logs}")

    def capture_routes(self, group, routes, authenticated=False):
        for viewport_name, (width, height) in VIEWPORTS.items():
            self.driver.set_window_size(width, height)
            for page_name, path in routes.items():
                with self.subTest(group=group, viewport=viewport_name, page=page_name):
                    self.open(path)
                    self.verify_page(f"{group}/{page_name}/{viewport_name}", authenticated)
                    self.capture_full_page(f"{group}_{page_name}_{viewport_name}.png")

    def capture_profile_edit_state(self, group, path, input_selector, expected_inputs):
        for viewport_name, (width, height) in VIEWPORTS.items():
            with self.subTest(group=group, viewport=viewport_name, page="profile_edit"):
                self.driver.set_window_size(width, height)
                self.open(path)
                edit_button = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//button[normalize-space()='Edit']")))
                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
                self.driver.execute_script("arguments[0].click();", edit_button)
                self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, input_selector)))
                self.assertEqual(len(self.driver.find_elements(By.CSS_SELECTOR, input_selector)), expected_inputs)
                self.assertTrue(self.driver.find_element(By.XPATH, "//button[normalize-space()='Save']").is_displayed())
                self.verify_page(f"{group}/profile_edit/{viewport_name}", authenticated=True)
                self.capture_full_page(f"{group}_profile_edit_{viewport_name}.png")

    def test_public_pages(self):
        self.capture_routes("public", PUBLIC_ROUTES)

    def test_guest_pages(self):
        self.login("guest")
        self.capture_routes("guest", ROLE_ROUTES["guest"], authenticated=True)
        self.capture_profile_edit_state("guest", "/guest-profile", "input.profile-input", 6)

    def test_manager_pages(self):
        self.login("manager")
        self.capture_routes("manager", ROLE_ROUTES["manager"], authenticated=True)
        self.capture_profile_edit_state("manager", "/managerprofile", "input.input-field", 7)

    def test_admin_pages(self):
        self.login("admin")
        self.capture_routes("admin", ROLE_ROUTES["admin"], authenticated=True)
        self.capture_profile_edit_state("admin", "/admindashboard/profile", ".profile-row input", 4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
