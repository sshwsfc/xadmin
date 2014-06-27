#!/bin/bash
# Author: tim.tang
rm -f changelog.md

git for-each-ref --sort='*authordate' --format='%(tag)' refs/tags | grep -v '^$' | tail -r | while read TAG ; do
    echo
    if [ $NEXT ];then
        echo '       ' >> changelog.md
        echo *$NEXT* >> changelog.md
        echo '---' >> changelog.md
    else
        echo '       ' >> changelog.md
        echo *CURRENT* >> changelog.md
        echo '---' >> changelog.md
    fi

    echo '    ' >> changelog.md
    GIT_PAGER=cat git log --no-merges --date=short  --pretty=format:'- %ad (%an) %s -> [view commit](https://github.com/sshwsfc/django-xadmin/commit/%H)' $TAG..$NEXT >> changelog.md
    echo '    ' >> changelog.md
    NEXT=$TAG
done
echo "DONE."