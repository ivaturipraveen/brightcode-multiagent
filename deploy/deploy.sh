#!/bin/bash
echo "[SAM] All tests passed. Triggering Render deploy..."
[ -n "$RENDER_BACKEND_DEPLOY_HOOK" ] && curl -s -X POST "$RENDER_BACKEND_DEPLOY_HOOK" && echo "Backend deploy triggered."
[ -n "$RENDER_FRONTEND_DEPLOY_HOOK" ] && curl -s -X POST "$RENDER_FRONTEND_DEPLOY_HOOK" && echo "Frontend deploy triggered."
echo "[SAM] Deploy complete."
