================ GIT / GITHUB WORKFLOW =================

# Check project status
git status

# Add all files
git add .

# Add specific file
git add filename

# Commit changes
git commit -m "your message"

# Push project to GitHub
git push origin main

# Pull latest changes from GitHub
git pull origin main

# Clone repository from GitHub
git clone https://github.com/username/repository.git

# Check branches
git branch

# Create new branch
git branch branch-name

# Create and switch branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Check commit history
git log

# Remove last commit (keep changes)
git reset --soft HEAD~1

# Remove last commit completely
git reset --hard HEAD~1

# Check remote repository
git remote -v

# Connect project to GitHub repository
git remote add origin https://github.com/username/repository.git

# First push (for new repository)
git push -u origin main

========================================================
MOST COMMON DAILY WORKFLOW

git status
git add .
git commit -m "update project"
git push origin main
========================================================