#!/bin/bash

function generate_directory_index {
  echo -e "Creating directory listing index.html for "$1
  (
    echo -e "<html>\n<body>\n<h1>Directory listing</h1>\n<hr/>\n<pre>"
    ls -1pa "${1}" |\
      grep -v "^\./$" |\
      grep -v "^\..*/$" |\
      grep -v "^index\.html$"|\
      awk '{ printf "<a href=\"%s\">%s</a>\n",$1,$1 }'
    echo -e "</pre>\n</body>\n</html>"
  ) > "${1}/index.html"
}
 
for DIR in $(find maven -type d  \( ! -regex '.*/\..*' \)); do
 generate_directory_index $DIR
done

for DIR in $(find . -type d \( ! -regex '.*/\..*' \)); do
	if([ ! -f ${DIR}/index.html ]);
		then
			generate_directory_index $DIR
	fi
done

