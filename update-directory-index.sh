#!/bin/bash

function generate_directory_index {
  echo -e "Creating directory listing index.html for "$1
  (
    echo -e "<html>\n<body>\n<h1 class=\"gds-autogen\">Directory listing</h1>\n<hr/>\n<code><table>"
    ls -1pal "${1}" |\
      grep -v "^.*\./$" |\
      grep -v "^.*\.\./$" |\
      grep -v "^.*index\.html$"|\
      awk '{ printf "<tr><td><a href=\"%s\">%s</a></td><td>%s %s %s</td></tr>\n",$9,$9, $6,$7,$8 }'
    echo -e "</table>\n</body>\n</html>"
  ) > "${1}/index.html"
}
 
for DIR in $(find maven -type d  \( ! -regex '.*/\..*' \)); do
 generate_directory_index $DIR
done

for DIR in $(find . -type d \( ! -regex '.*/\..*' \)); do
	if [ ! -f ${DIR}/index.html ]
	then
		generate_directory_index $DIR
	else
		contents=`cat $DIR/index.html`
		
		if [[ "$contents" == *autogen* ]]
		then
			generate_directory_index $DIR
		fi
	fi
done

