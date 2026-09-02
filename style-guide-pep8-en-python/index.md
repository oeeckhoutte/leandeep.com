# Style guide PEP8 en Python

- Canonical URL: https://leandeep.com/style-guide-pep8-en-python/
- Author: Olivier Eeckhoutte
- Published: 2017-02-01T21:54:00Z
- Updated: 2017-02-01T21:54:00Z
- Language: fr
- Tags: Python, python_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Je recommande de suivre le style guide PEP 8 pour coder en Python. 

```
# Whitespace: In Python, whitespace is syntactically significant. Python
# programmers are especially sensitive to the effects of whitespace on
# code clarity.

# 1. Use spaces instead of tabs for indentation.
# 2. Use four spaces for each level of syntactically significant indenting.
# 3. Lines should be 79 characters in length or less.
# 4. Continuations of long expressions onto additional lines should be
#     indented by four extra spaces from their normal indentation level.
# 5. In a file, functions and classes should be separated by two blank lines.
# 6. In a class, methods should be separated by one blank line.
# 7. Don't put spaces around list indexes, function calls, or keyword
#     argument assignments.
# 8. Put one-and only one-space before and after variable assignments.
```

```
# Naming: PEP 8 suggests unique styles of naming for different part in the
# language.

# 1. Functions, variables, and attributs should be in lovercase_underscore
#     format.
# 2. Protected instance attributes should be in _leading_underscore format.
# 3. Private instance attributes should be in __double_leading_underscore
#     format.
# 4. Classes and exceptions should be in CapitalizedWord format.
# 5. Module-level constants should be in ALL_CAPS format.
# 6. Instance methods in classes should use self as the name of the first
#     parameter (which refers to the object).
# 7. Class methods should use cls as the name of the first parameter (which
# refers to the class).
```

```
# Expressions and Statements: The Zen of Python states: "There should be one-
# and preferably only one-obvious way to do it."

# 1. Use inline negation (if a is not b) instead of negative of positive
#     expressions (if not a is b)
# 2. Don't check for empty value (like [] or '') by checking the length
#     (if len(somelist) == 0). Use if not somelist and assume empty values
#     implicitly evaluate to False.
# 3. The same thing goes for non-empty values (like [1] or 'hi'). The statement
#     if somelist is implicitly True for non-empty values.
# 4. Avoid single-line if statements, for and while loops, and except compound
#     statements. Spread these over multiple lines for clarity.
# 5. Always put import statements as the top of a file.
# 6. Always use absolute names for modules when importing them, not names
#     relative to the current module's own path. For example, to import the foo
#     module for the bar package, you should do from bar import foo, not just
#     import foo.
# 7. If you must do relative imports, use the explicit syntax from . import foo.
# 8. Imports should be in sections in the following order: standard library
#     modules, third-party modules, your own modules. Each subsection should
#     have imports in alphabetical order.
```
... Ceci n'est qu'un aperçu.

Avec de bons outils comme flake8, il est facile de linter son code pour faire en sorte qu'il respecte certains style guides. Le slogan de Flake8 est parlant: "Your Tool For Style Guide Enforcement". 

> Attention à ceci: 
> "It is very important to install Flake8 on the correct version of Python for your needs. If you want Flake8 to properly parse new language features in Python 3.5 (for example), you need it to be installed on 3.5 for Flake8 to understand those features. In many ways, Flake8 is tied to the version of Python on which it runs." Source http://flake8.pycqa.org

<br/>

Flake8 est un outil qui vérifie grâce à pyflakes la conformité du code Python avec pep8 et la *circular complexity*.

Pour utiliser flake8 avec VScode, il suffit de créer un fichier `.flake8` à la racine de votre projet et de coller le contenu suivant:

```
[flake8]
filename = *.py,*.pyx,*.pxd,*.pxi
ignore = E402,E731,D100,D101,D102,D103,D104,D105,W503,W504,E252
exclude = .git,__pycache__,build,dist,.eggs,postgres,vendor

per-file-ignores = *.pyx,*.pxd,*.pxi: E211, E222, E225, E226, E227, E999

max-line-length = 160
```

<br/>

Remarque, il est possible d'ignorer certaines rêgles.

Il faut aussi créer un fichier `.vscode/settings.json` pour dire à VScode d'utiliser flake8 comme linter. 

Voici un exemple de fichier settings.

```
{
    "python.pythonPath": ".venv/bin/python3.5",
    "python.linting.pylintEnabled": false,
    "python.linting.flake8Enabled": true,
    "python.linting.enabled": true
}
```

