#!/bin/bash

paths="../app ../../embedded"

bold=$(tput bold)
normal=$(tput sgr0)

function contains() {
    local n=$#
    local value=${!n}
    for ((i=1;i < $#;i++)) {
        if [ "${!i}" == "${value}" ]; then
            echo "y"
            return 1
        fi
    }
    echo "n"
    return 0
}

if [ ! -z "$1" ]
then
    grep -rnw $paths -e "$1"
    res=$(grep -rnw $paths -e "$1" | wc -l) #outputs count
    shouldbe=0

    if [ $res == $shouldbe ]
    then
        locales=$PWD/*

        for f in $locales
        do
            if [[ $f != *"english"* ]]
            then
                continue
            else
                echo -e "\033[33mSearching in ${bold}$f ${normal}\033[33mfor ${bold}$1${normal}...\n"

                oldsize=$(wc -c < "$f")

                node locale_create.js $f $1 $2

                newsize=$(wc -c < "$f")

                if [[ $oldsize == $newsize ]]
                then
                    echo -e "\033[31mKey not added or an error has occurred.\n"
                else
                    echo -e "\033[32mKey added.\n"
                fi
            fi
        done
    else
        echo -e "\n"
        echo -e "\033[35mCannot add ${bold}$1${normal} \033[35munder ${bold}english.json${normal}\033[35m, key in use. Check output above.\033[0m\n"

        sleep 0.5
    fi
else
    echo -e "\033[36mNo key specified. Switching to search & create mode in 3 seconds.\n"

    sleep 3

    locales=$PWD/*

    for f in $locales
    do
        if [[ $f != *"english"* ]]
        then
            continue
        else
            oldsize=$(wc -c < "$f")

            node locale_create.js $f

            IFS=$',' GLOBIGNORE='*' command eval  'JSON=($(cat ./jsonoutput.txt))'
            unset IFS

            IFS=$',' GLOBIGNORE='*' command eval  'extKeys=($(cat ./extKeys.txt))'
            unset IFS

            for i in "${extKeys[@]}"
            do
                :
                if [ $(contains "${JSON[@]}" "$i") == "n" ]; then
                    if [[ $i == *";"* ]]
                    then
                        key=$(cut -d ";" -f 1 <<< "$i")
                        fallback=$(cut -d ";" -f 2 <<< "$i")

                        res=$(grep -rnw $f -e "$key" | wc -l) #outputs count
                        shouldbe=0

                        if [ $res == $shouldbe ]
                        then
                            echo -e "\033[33mKey ${bold}$key${normal}\033[33m with fallback ${bold}$fallback${normal}\033[33m not found in ${bold}$f${normal}\033[33m.\n"

                            node locale_create.js $f $key "$fallback"
                        fi
                    else
                        echo -e "\033[33m${bold}$i${normal}\033[33m not found in ${bold}$f${normal}\033[33m. Since no fallback was detected, adding it as key.name text.\n"

                        todo="$i text"

                        node locale_create.js $f $i $todo
                    fi
                fi
            done

            newsize=$(wc -c < "$f")

            if [[ $oldsize == $newsize ]]
            then
                echo -e "\033[31mKey(s) not added or an error has occurred.\n"
            else
                echo -e "\033[32mKey(s) added.\n"
            fi

            rm ./jsonoutput.txt
            rm ./extkeys.txt
        fi
    done
fi
