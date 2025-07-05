# README

## Installation

### Required software

- Git bash (Windows only)
```bash
winget install --id Git.Git -e --source winget
```

- Python : https://www.python.org/downloads/


### Environment

#### Creation
```bash
mkdir SWEProject && cd SWEProject
python -m venv sweenv
```

#### Activation
```bash
source sweenv/Scripts/activate
```

> **On Linux and MacOS** : Rename the *Scripts* file by *bin*

#### Dependencies
```bash
pip install django
pip install selenium
```
Geckodriver
- Get your version here : https://github.com/mozilla/geckodriver/releases
- Put the extracted file in the 'Scripts' directory of your virtual environment.
- Test : geckodriver --version

### Get the project on GitHub

```bash
git clone https://github.com/uit-inf-2900/git
```

### Register as an admin

```bash
python manage.py createsuperuser
```

## Usefull commands

Start the server
```bash
python manage.py runservergit
cd reactapp && npm start
```

### Git & GitHub

#### Commit

> **Before commit** : check if there is some temporary files not included in the *.gitignore* file.  

```bash
git add *your updated files (can be * or .)*
git commit -m "*version description*"
```

#### Push

```bash
git push origin *your branch name*
```

#### Get from GitHub

```bash
git pull origin
```

> **Conflicts can happends, you can check which files with (git status) && you have to correct it (can be simplier with an IDE)**

#### Merge

```bash
git merge *other branch name*
```

#### Branchs

| Action | Command                       |
|--------|-------------------------------|
| List   | `git branch -l`               |
| Create | `git branch *branch name*`    |
| Move   | `git checkout *branch name*`  |
| Delete | `git branch -d *branch name*` |


#### Versions

| Action   | Command                             |
|----------|-------------------------------------|
| Display  | `git log [--graph`                  |
| Rollback | `git reset --hard *version number*` |

#### Advices
- Use `git add *files*` not `git add .`
- Check before you start coding if you are in the good branch
- Commit often (just after you solve a bug, dev/correct a feature, ...) one commit = one task
- Don't use "`git push`" but "git push *remote name branch name*"

