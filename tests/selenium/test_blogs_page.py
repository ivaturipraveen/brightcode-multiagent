from pathlib import Path


def test_blogs_route_registered_in_frontend_router():
    app_file = Path('frontend/src/App.tsx').read_text(encoding='utf-8')

    assert 'path="/blogs"' in app_file
    assert 'element={<BlogsPage />}' in app_file


def test_blogs_page_contains_curated_sources_and_posts():
    page_file = Path('frontend/src/pages/BlogsPage.tsx').read_text(encoding='utf-8')

    assert 'AI Toast' in page_file
    assert 'Superhuman AI' in page_file
    assert 'Claude for Teachers just launched' in page_file
    assert 'ChatGPT Work just launched' in page_file
    assert 'https://aitoast.beehiiv.com/' in page_file
    assert 'https://superhumani.ai/' in page_file
