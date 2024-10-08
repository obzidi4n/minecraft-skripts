#
# yaml-tests.sk originally made by rezz and modified by pikachu to test against 'skript-yaml' instead of the other addon
#
options:
    PAUSE: wait 2 ticks

    SET_TESTS: 2500
    SET_PAUSE: 250

    GET_TESTS: 2500
    GET_PAUSE: 250

on script load:

    delete {test::*}

on script unload:

    delete {test::*}

function randomString(length: integer = 20, alphabet: string = "abcdefghijklmnopqrstuvwxyz0123456789-_") :: string:

    set {_chars::*} to {_alphabet} split at ""
    set {_string} to ""

    while length of {_string} is less than {_length}:

        set {_string} to "%{_string}%%random element out of {_chars::*}%"

    return {_string}

command /yamltest:
    trigger:
        delete {test::*}

        send "&aSetting {@SET_TESTS} variables..."

        set {_var-set-start} to now
        set {_var-set-iterations} to 0

        while {_var-set-iterations} is less than {@SET_TESTS}:

            set {_key} to randomString()

            {test::%{_key}%} isn't set

            set {test::%{_key}%} to {_key}

            add 1 to {_var-set-iterations}

            mod({_var-set-iterations}, {@SET_PAUSE}) is 0

            send "Set %{_var-set-iterations}% variables. %difference between now and {_var-set-start}% since starting."

        set {_var-set-time} to difference between now and {_var-set-start}
        send "&6Variable-set test:&f %{_var-set-time}%"

        if file "plugins/test/test.yml" exists:
            delete file "plugins/test/test.yml"
        load yml "plugins/test/test.yml"

        send "&aSetting {@SET_TESTS} YAML values..."

        set {_yaml-set-start} to now
        set {_yaml-set-iterations} to 0

        loop {test::*}:

            set skript-yaml value loop-index in "test" to loop-value
            add 1 to {_yaml-set-iterations}

            mod({_yaml-set-iterations}, {@SET_PAUSE}) is 0

            send "Set %{_yaml-set-iterations}% YAML values. %difference between now and {_yaml-set-start}% since starting."
        save yml "test"
        set {_yaml-set-time} to difference between now and {_yaml-set-start}
        send "&6YAML-set test: &f%{_yaml-set-time}%"

        #
        #   GET TESTS
        #
        send "&aTesting {@GET_TESTS} random variables"

        set {_var-get-start} to now

        loop {@GET_TESTS} times:

            set {_var-get-key} to a random element out of {test::*}
            set {_var-get-value} to {test::%{_var-get-key}%}

            mod(loop-number, {@GET_PAUSE}) is 0

            send "Got %loop-number% values. %difference between now and {_var-get-start}% since starting."

        set {_var-get-time} to difference between now and {_var-get-start}
        send "&6Variable-get test: &f%{_var-get-time}%"

        send "&aTesting {@GET_TESTS} random YAML values"

        set {_yaml-get-start} to now

        loop {@GET_TESTS} times:

            set {_yaml-get-key} to a random element out of {test::*}
            set {_yaml-get-value} to skript-yaml value {_yaml-get-key} from "test"
         
            mod(loop-number, {@GET_PAUSE}) is 0

            send "Got %loop-number% YAML values. %difference between now and {_yaml-get-start}% since starting."

        set {_yaml-get-time} to difference between now and {_yaml-get-start}
        send "&6YAML-get test: &f%{_yaml-get-time}%"

        send "<light red>-- RESULTS: ---"
        send "&bSet {@SET_TESTS} variables test:&f %{_var-set-time}%"
        send "<yellow>Set {@SET_TESTS} YAML values test: &f%{_yaml-set-time}%"
        send "&bGet {@GET_TESTS} variables test: &f%{_var-get-time}%"
        send "<yellow>Get {@GET_TESTS} YAML values test: &f%{_yaml-get-time}%"