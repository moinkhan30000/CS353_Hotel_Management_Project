import os
import time
import unittest

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("E2E_BASE_URL", "http://localhost:5173").rstrip("/")
HEADLESS = os.getenv("E2E_HEADLESS", "true").lower() != "false"

ACCOUNTS = {
    "guest": ("guest@hotel.test", "Guest123!", "/guest-dashboard"),
    "manager": ("manager@hotel.test", "Manager123!", "/managerhoteldashboard"),
    "admin": ("admin@hotel.test", "Admin123!", "/admindashboard"),
}

ROLE_LINKS = {
    "guest": [
        "/guest-profile",
        "/guest-dashboard",
        "/reservation-history",
        "/payment-history",
        "/guest-topup",
        "/guest-reviews",
    ],
    "manager": [
        "/managerprofile",
        "/managerhoteldashboard",
        "/manage-bookings",
        "/rooms",
        "/edit-hotel-images",
        "/reviews",
    ],
    "admin": [
        "/admindashboard/profile",
        "/admindashboard",
        "/admindashboard/reports",
    ],
}


class HorizonStayEndToEndTests(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        if HEADLESS:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,1100")
        options.add_argument("--disable-search-engine-choice-screen")
        options.add_argument("--no-default-browser-check")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 12)
        self.driver.get(BASE_URL)
        self.driver.execute_script("window.localStorage.clear();")
        self.driver.get(BASE_URL)

    def tearDown(self):
        self.driver.quit()

    def open(self, path):
        self.driver.get(f"{BASE_URL}{path}")
        self.wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")

    def assert_page_healthy(self):
        body = self.driver.find_element(By.TAG_NAME, "body").text
        self.assertTrue(body.strip(), "The page rendered no visible content.")
        self.assertNotIn("Page not found", body)
        self.assertNotIn("Something went wrong", body)

    def login(self, role):
        email, password, destination = ACCOUNTS[role]
        self.open(f"/login/{role}")
        self.wait.until(EC.visibility_of_element_located((By.ID, "login-email"))).send_keys(email)
        self.driver.find_element(By.ID, "login-password").send_keys(password)
        self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".login-submit"))).click()
        destinations = [destination]
        if role == "manager":
            destinations.append("/managerdashboard")
        self.wait.until(lambda driver: any(path in driver.current_url for path in destinations))
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".private-nav")))

    def open_account_menu(self):
        nav = next(element for element in self.driver.find_elements(By.CSS_SELECTOR, ".private-nav") if element.is_displayed())
        trigger = nav.find_element(By.CSS_SELECTOR, ".user-info")
        trigger.click()
        self.wait.until(lambda driver: any(element.is_displayed() for element in nav.find_elements(By.CSS_SELECTOR, ".dropdown-content")))
        return next(element for element in nav.find_elements(By.CSS_SELECTOR, ".dropdown-content") if element.is_displayed())

    def test_public_discovery_and_newsletter(self):
        self.open("/")
        self.assert_page_healthy()
        see_all = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".see-all")))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", see_all)
        see_all.send_keys(Keys.ENTER)
        self.wait.until(EC.url_contains("/properties"))
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".property-card")))
        self.open("/")
        email = f"selenium-{int(time.time())}@hotel.test"
        newsletter = self.driver.find_element(By.ID, "newsletter-email")
        newsletter.send_keys(email)
        newsletter.send_keys(Keys.ENTER)
        status = self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".promo [role='status']")))
        self.assertTrue(status.text.strip())

    def test_guest_navigation_and_access_control(self):
        self.login("guest")
        menu = self.open_account_menu()
        hrefs = [link.get_attribute("href") for link in menu.find_elements(By.TAG_NAME, "a")]
        for path in ROLE_LINKS["guest"]:
            self.assertIn(f"{BASE_URL}{path}", hrefs)
            self.open(path)
            self.assert_page_healthy()
            self.assertTrue(self.driver.find_element(By.CSS_SELECTOR, ".private-nav").is_displayed())

        self.open("/managerhoteldashboard")
        self.wait.until(EC.url_matches(f"{BASE_URL}/?$"))

    def test_manager_navigation(self):
        self.login("manager")
        menu = self.open_account_menu()
        hrefs = [link.get_attribute("href") for link in menu.find_elements(By.TAG_NAME, "a")]
        for path in ROLE_LINKS["manager"]:
            self.assertIn(f"{BASE_URL}{path}", hrefs)
            self.open(path)
            self.assert_page_healthy()
            self.assertTrue(self.driver.find_element(By.CSS_SELECTOR, ".private-nav").is_displayed())

    def test_admin_navigation_and_reports(self):
        self.login("admin")
        menu = self.open_account_menu()
        hrefs = [link.get_attribute("href") for link in menu.find_elements(By.TAG_NAME, "a")]
        for path in ROLE_LINKS["admin"]:
            self.assertIn(f"{BASE_URL}{path}", hrefs)
            self.open(path)
            self.assert_page_healthy()
            self.assertTrue(self.driver.find_element(By.CSS_SELECTOR, ".private-nav").is_displayed())

        self.open("/admindashboard")
        self.driver.find_element(By.XPATH, "//button[normalize-space()='Generate Report']").click()
        self.wait.until(EC.url_contains("/admindashboard/reports/view"))
        self.assertIn("Report", self.driver.find_element(By.TAG_NAME, "body").text)

    def test_logged_out_user_is_redirected(self):
        for path in ("/guest-profile", "/rooms", "/admindashboard/reports"):
            self.open(path)
            try:
                self.wait.until(EC.url_contains("/login"))
            except TimeoutException as error:
                self.fail(f"{path} did not redirect a logged-out user: {error}")

    def test_registration_role_selection(self):
        self.open("/register/guest")
        guest = self.driver.find_element(By.XPATH, "//div[contains(@class,'register-role-selector')]//button[normalize-space()='Guest']")
        manager = self.driver.find_element(By.XPATH, "//div[contains(@class,'register-role-selector')]//button[normalize-space()='Manager']")
        self.assertEqual(guest.get_attribute("aria-pressed"), "true")
        self.assertTrue(self.driver.find_element(By.XPATH, "//label[contains(.,'Identity number')]").is_displayed())
        manager.click()
        self.assertEqual(manager.get_attribute("aria-pressed"), "true")
        self.assertFalse(self.driver.find_elements(By.XPATH, "//label[contains(.,'Identity number')]"))

        self.open("/register/manager")
        manager = self.driver.find_element(By.XPATH, "//div[contains(@class,'register-role-selector')]//button[normalize-space()='Manager']")
        self.assertEqual(manager.get_attribute("aria-pressed"), "true")

    def assert_profile_edit_state(self, role, path, selector, expected_inputs):
        self.login(role)
        self.open(path)
        edit_button = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//button[normalize-space()='Edit']")))
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
        self.driver.execute_script("arguments[0].click();", edit_button)
        self.wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, selector)))
        self.assertEqual(len(self.driver.find_elements(By.CSS_SELECTOR, selector)), expected_inputs)
        self.assertTrue(self.driver.find_element(By.XPATH, "//button[normalize-space()='Save']").is_displayed())

    def test_guest_profile_edit_state(self):
        self.assert_profile_edit_state("guest", "/guest-profile", "input.profile-input", 6)

    def test_manager_profile_edit_state(self):
        self.assert_profile_edit_state("manager", "/managerprofile", "input.input-field", 7)

    def test_admin_profile_edit_state(self):
        self.assert_profile_edit_state("admin", "/admindashboard/profile", ".profile-row input", 4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
