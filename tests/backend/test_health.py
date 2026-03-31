def test_health_endpoint(client):
    response = client.get('/health')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok', 'service': 'brightcone'}


def test_health_db_endpoint(client):
    response = client.get('/health/db')

    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'ok'
    assert data['service'] == 'brightcone'
    assert data['database'] in ('postgresql', 'sqlite')
