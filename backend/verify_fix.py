import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def get_token():
    payload = {"login": "admin", "password": "123456"}
    try:
        r = requests.post(f"{BASE_URL}/token", json=payload)
        if r.status_code == 200:
            return r.json()["access_token"]
        else:
            print(f"Login failed: {r.status_code} {r.text}")
    except Exception as e:
        print(f"Connection error: {e}")
    return None

def test_update_product():
    token = get_token()
    if not token:
        print("Could not get token, skipping live API test.")
        return

    product_id = 1
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test case 1: Partial update (should work now)
    payload = {
        "name": "Updated TSS Pro Test",
        "description": "New description test"
    }
    
    print(f"Testing update with payload: {payload}")
    r = requests.put(f"{BASE_URL}/products/{product_id}", json=payload, headers=headers)
    if r.status_code == 200:
        print("Test 1 SUCCESS: Partial update worked!")
    else:
        print(f"Test 1 FAILED: {r.status_code} {r.text}")

    # Test case 2: Empty strings for numbers (should work now due to defaults/cleanup)
    # The frontend does cleanup, let's see if backend schema accepts it with defaults
    payload2 = {
        "name": "Updated TSS Pro 2",
        "description": "Description 2",
        "price": 0,
        "power": 0
    }
    print(f"Testing update with payload: {payload2}")
    r = requests.put(f"{BASE_URL}/products/{product_id}", json=payload2, headers=headers)
    if r.status_code == 200:
        print("Test 2 SUCCESS: Update with explicit 0s worked!")
    else:
        print(f"Test 2 FAILED: {r.status_code} {r.text}")
    
if __name__ == "__main__":
    test_update_product()
