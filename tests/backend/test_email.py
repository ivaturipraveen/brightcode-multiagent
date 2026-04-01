import os
from unittest.mock import patch


def register_and_login(client):
    client.post('/auth/register', json={'name': 'Email User', 'email': 'emailuser@example.com', 'password': 'secret123'})
    response = client.post('/auth/login', json={'email': 'emailuser@example.com', 'password': 'secret123'})
    return response.json()['access_token']


def auth_headers(token):
    return {'Authorization': f'Bearer {token}'}


def test_send_email_success(client):
    token = register_and_login(client)
    mock_result = {"id": "mock-email-id-123"}
    with patch("routes.email.resend.Emails.send", return_value=mock_result):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        response = client.post("/email/send", json={
            "to": "test@example.com",
            "subject": "Hello World",
            "html": "<p>Test email</p>",
        }, headers=auth_headers(token))
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "mock-email-id-123"
    assert data["message"] == "Email sent successfully"


def test_send_email_logs_to_db(client):
    token = register_and_login(client)
    mock_result = {"id": "mock-log-id-456"}
    with patch("routes.email.resend.Emails.send", return_value=mock_result):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        client.post("/email/send", json={
            "to": "logged@example.com",
            "subject": "Log Test",
            "html": "<p>Log this</p>",
        }, headers=auth_headers(token))

    logs_response = client.get("/email/logs", headers=auth_headers(token))
    assert logs_response.status_code == 200
    logs = logs_response.json()
    assert len(logs) == 1
    assert logs[0]["to_email"] == "logged@example.com"
    assert logs[0]["subject"] == "Log Test"
    assert logs[0]["status"] == "sent"


def test_send_email_missing_api_key(client):
    token = register_and_login(client)
    os.environ.pop("RESEND_API_KEY", None)
    response = client.post("/email/send", json={
        "to": "test@example.com",
        "subject": "Hello",
        "html": "<p>Test</p>",
    }, headers=auth_headers(token))
    assert response.status_code == 500
    assert "not configured" in response.json()["detail"]


def test_send_email_resend_failure(client):
    token = register_and_login(client)
    with patch("routes.email.resend.Emails.send", side_effect=Exception("API error")):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        response = client.post("/email/send", json={
            "to": "test@example.com",
            "subject": "Hello",
            "html": "<p>Test</p>",
        }, headers=auth_headers(token))
    assert response.status_code == 502
    assert "Failed to send email" in response.json()["detail"]


def test_get_email_logs_empty(client):
    token = register_and_login(client)
    response = client.get("/email/logs", headers=auth_headers(token))
    assert response.status_code == 200
    assert response.json() == []


def test_get_outreach_report(client):
    token = register_and_login(client)
    mock_result = {"id": "report-test-id"}
    with patch("routes.email.resend.Emails.send", return_value=mock_result):
        os.environ["RESEND_API_KEY"] = "re_test_key"
        client.post("/email/send", json={
            "to": "a@example.com", "subject": "Hi", "html": "<p>Hello</p>",
        }, headers=auth_headers(token))
        client.post("/email/send", json={
            "to": "b@example.com", "subject": "Hey", "html": "<p>World</p>",
        }, headers=auth_headers(token))

    report = client.get("/email/report", headers=auth_headers(token))
    assert report.status_code == 200
    data = report.json()
    assert data["total_sent"] == 2
    assert data["total_failed"] == 0
    assert data["unique_recipients"] == 2
    assert len(data["logs"]) == 2
