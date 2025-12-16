#!/bin/bash
set -e

# Configuration
AUTHOR_NAME="Viktor Silakov"
AUTHOR_EMAIL="23633060+viktor-silakov@users.noreply.github.com"
TAGS=(v2.3.2 v2.3.3 v2.3.4 v2.4.0 v2.4.1 v2.5.3 v2.6.0 v2.6.1 v3.0.0 v3.1.0)

export GIT_AUTHOR_NAME="$AUTHOR_NAME"
export GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL"
export GIT_COMMITTER_NAME="$AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL"

echo "=== Step 1: Creating orphan branch with initial state ==="

# Get the commit before the first tag
FIRST_TAG_COMMIT=$(git rev-parse v2.3.2)
echo "First tag (v2.3.2) commit: $FIRST_TAG_COMMIT"

# Create orphan branch
git checkout --orphan fresh-main
git reset --hard
git rm -rf . 2>/dev/null || true

# Checkout files from first tag
git checkout v2.3.2 -- .
git add -A
git commit -m "Initial: All history before v2.3.2 (archived in syngrisi_archive_repo_3_0)"
echo "Created initial commit"

echo "=== Step 2: Creating commits for each tag ==="

for tag in "${TAGS[@]}"; do
  echo "Processing tag: $tag"
  git checkout "$tag" -- .
  git add -A
  git commit -m "Release $tag" --allow-empty
  
  # Delete old tag and create new one pointing to this commit
  git tag -d "$tag" 2>/dev/null || true
  git tag "$tag"
  echo "Created commit and tag for $tag"
done

echo "=== Step 3: Adding current HEAD state ==="

# Get files from original main
git checkout origin/main -- .
git add -A
git commit -m "Current development state (post v3.1.0)"
echo "Created HEAD commit"

echo "=== Step 4: Cleanup ==="

# Show the new history
echo ""
echo "=== New history ==="
git log --oneline

echo ""
echo "=== Tags ==="
git tag -l

echo ""
echo "=== Done! ==="
echo "To apply changes, run:"
echo "  git branch -D main"
echo "  git branch -m fresh-main main"
echo "  git push origin main --force"
echo "  git push origin --tags --force"
