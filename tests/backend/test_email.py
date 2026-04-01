import os
from unittest.mock import patch, MagicMock


def test_send_email_success(client):
    mock_result = {"id": "mock-email-id-123"}
    with patch("routes.email.resend.Emails.send", return_value=mock_result):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        response = client.post("/email/send", json={
            "to": "test@example.com",
            "subject": "Hello World",
            "html": "<p>Test email</p>",
        })
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "mock-email-id-123"
    assert data["message"] == "Email sent successfully"


def test_send_email_missing_api_key(client):
    os.environ.pop("RESEND_API_KEY", None)
    response = client.post("/email/send", json={
        "to": "test@example.com",
        "subject": "Hello",
        "html": "<p>Test</p>",
    })
    assert response.status_code == 500
    assert "not configured" in response.json()["detail"]


def test_send_email_resend_failure(client):
    with patch("routes.email.resend.Emails.send", side_effect=Exception("API error")):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        response = client.post("/email/send", json={
            "to": "test@example.com",
            "subject": "Hello",
            "html": "<p>Test</p>",
        })
    assert response.status_code == 502
    assert "Failed to send email" in response.json()["detail"]
