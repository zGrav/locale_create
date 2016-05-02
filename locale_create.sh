#!/bin/bash

paths="../app ../../embedded"

bold=$(tput bold)
normal=$(tput sgr0)

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
fi
