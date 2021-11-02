git update-index -q --ignore-submodules --refresh
if ! git diff-files --quiet --ignore-submodules --
then
    echo "Warning: Your local changes would be overwritten, Please commit or stash them and try again."
    exit
fi

latest_version=`date +"%Y%m%d%H%M"`
echo "version=${latest_version}"
git tag github-${latest_version}

echo "patch start..."
userName=$(git config --get user.name)
userEmail=$(git config --get user.email)
echo "user.name is ${userName}"
echo "user.email is ${userEmail}"
echo -e "changes between the branches:\n $(git diff master github_latest --stat)\e"

echo "patching..." 
git checkout github_latest
git diff github_latest master>>tmp.patch
git apply tmp.patch
rm -rf tmp.patch patch_to_github.sh

git config user.name "Harry Potter"
git config user.email "harry@potter.com"

git add .
git commit -m "latest"
git push github HEAD:master

echo "revert user info"
git config user.name "${userName}"
git config user.email "${userEmail}"

git checkout master

echo "user.name is $(git config --get user.name)"
echo "user.email is $(git config --get user.email)"
echo "patched success"
