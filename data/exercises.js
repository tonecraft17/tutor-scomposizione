/* ============================================================
   DATA · EXERCISES — Python Crash Course (3rd ed.), Ch. 1–20 + Appendices D–E
   ------------------------------------------------------------
   English edition (v13.0) — translated from the Italian v12.1.1.
   Every exercise is broken down into sequential micro-phrases.
   In the phrases, {{word}} = clickable keyword (hint popup).
   Step format:
     f  : the logical micro-phrase
     k  : {word: [level 1 · concept, level 2 · syntax]}
     c  : expected code line(s) · re: accepted patterns
     so : expected console output (used as a soft check when the
          real runtime is absent) · btn/ta/min: exploratory or
          reflection steps
   ============================================================ */
const CH = [
 {
  "n": 1,
  "t": "Getting Started",
  "sub": "Development environment, hello world, and troubleshooting",
  "concepts": [
   "Installing Python and VS Code",
   "Your first program: hello_world.py",
   "Running snippets in the interpreter (>>>)",
   "Reading tracebacks"
  ],
  "ex": [
   {
    "id": "1-1",
    "t": "python.org",
    "orig": "python.org",
    "lvl": 1,
    "tr": "Explore the Python home page (https://python.org) to find topics that interest you. As you become more familiar with Python, different parts of the site will be more useful to you.",
    "steps": [
     {
      "f": "Open your browser and visit {{python.org}}, the official website of the language.",
      "k": {
       "python.org": [
        "The official home of the Python community: downloads, documentation, events, and news.",
        "https://python.org"
       ]
      },
      "c": null,
      "btn": "✓ Site visited",
      "note": "Take a look at the Docs and Community entries in the menu: they'll become your go-to reference points."
     },
     {
      "f": "Find the {{Docs}} section: it will become your reference manual.",
      "k": {
       "Docs": [
        "The official documentation: every function, module, and error has its own reference page.",
        "python.org → Docs → Language Reference / Library Reference"
       ]
      },
      "c": null,
      "btn": "✓ Section found"
     }
    ],
    "ch": 1
   },
   {
    "id": "1-2",
    "t": "Hello World Typos",
    "orig": "Hello World Typos",
    "lvl": 1,
    "tr": "Open the hello_world.py file you just created. Make a typo, and run the program again.\n  <ul><li>Can you generate an error?</li><li>Can you make sense of the error message?</li><li>Can you make a mistake that does <b>not</b> produce an error? Why do you think it didn't cause a problem?</li></ul>",
    "steps": [
     {
      "f": "Write the statement that {{print}}s the message to the screen.",
      "k": {
       "print": [
        "To display text on screen you use the built-in <code>print</code> function, followed by parentheses enclosing the text in quotes.",
        "print(\"Hello Python world!\")"
       ]
      },
      "c": "print(\"Hello Python world!\")",
      "re": "^print\\s*\\(\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "Hello Python world!"
      ]
     },
     {
      "f": "Remove one {{quote}} and \"run\": watch what kind of error appears.",
      "k": {
       "quote": [
        "Strings must be opened and closed: if the closing one is missing, the interpreter can't tell where the text ends.",
        "SyntaxError: unterminated string literal"
       ]
      },
      "c": null,
      "btn": "✓ Error observed",
      "note": "The traceback shows the file, the line, and the kind of error: it's your ally, learn to read it."
     },
     {
      "f": "Type {{PRINT}} with a capital P and run it: what error do you get?",
      "k": {
       "PRINT": [
        "Python is case-sensitive: <code>print</code> and <code>PRINT</code> are two different names.",
        "NameError: name 'PRINT' is not defined"
       ]
      },
      "c": null,
      "btn": "✓ Error observed"
     },
     {
      "f": "Try a mistake that does NOT cause problems: add a {{space}} inside the quotes.",
      "k": {
       "space": [
        "Spaces INSIDE the string are part of the text; the program still runs, but the message changes slightly.",
        "print(\" Hello Python world!\")  → no error"
       ]
      },
      "c": null,
      "btn": "✓ No error",
      "note": "Spaces outside the quotes are harmless too: print( \"hello\" ) works."
     }
    ],
    "ch": 1
   },
   {
    "id": "1-3",
    "t": "Infinite Skills",
    "orig": "Infinite Skills",
    "lvl": 1,
    "tr": "If you had infinite programming skills, what would you build? You're about to learn how to program: if you have an end goal in mind, you'll have an immediate use for your new skills. It's a good habit to keep an \"ideas\" notebook. Take a few minutes to describe three programs you'd like to create.",
    "steps": [
     {
      "f": "Describe the {{first program}} you'd like to create.",
      "k": {
       "first program": [
        "One sentence is enough: what the program does, who it's for, and why you need it. Writing it down now will keep you motivated for weeks.",
        "e.g. \"A quiz with questions to review history before tests\""
       ]
      },
      "c": null,
      "ta": "e.g. A riddle game to review geometry…",
      "min": 15
     },
     {
      "f": "Describe the {{second program}}.",
      "k": {
       "second program": [
        "Same here: one sentence with what it does and who it's for.",
        "e.g. \"A viewer for my running times\""
       ]
      },
      "c": null,
      "ta": "e.g. A chart of my gym progress…",
      "min": 15
     },
     {
      "f": "Describe the {{third program}}.",
      "k": {
       "third program": [
        "Last idea: by the end of the book you'll already be able to build one of these!",
        "e.g. \"A site to jot down what I learn\""
       ]
      },
      "c": null,
      "ta": "e.g. A small catalog app for my book collection…",
      "min": 15
     }
    ],
    "ch": 1
   }
  ]
 },
 {
  "n": 2,
  "t": "Variables and Simple Data Types",
  "sub": "Variables, strings, numbers, and comments",
  "concepts": [
   "Variables are labels, not boxes",
   "Strings and methods: title(), upper(), lower(), strip()…",
   "f-strings for embedding values in text",
   "Integers, floats, and arithmetic",
   "Comments with #"
  ],
  "ex": [
   {
    "id": "2-1",
    "t": "Simple Message",
    "orig": "Simple Message",
    "lvl": 1,
    "tr": "Assign a message to a variable, and then print that message. Save the program under a name that follows Python naming conventions (lowercase letters and underscores), such as <code>simple_message.py</code>.",
    "steps": [
     {
      "f": "Create a variable called {{msg}} and assign it any sentence you like.",
      "k": {
       "msg": [
        "A variable is a label you attach to a value: short, all-lowercase, descriptive name. The assignment operator is the <code>=</code> symbol, and the sentence is a string in quotes.",
        "msg = \"any sentence you like\""
       ]
      },
      "c": "msg = \"Python is fun\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$",
      "note": "Any name and sentence will do: what matters here is the <code>name = value</code> structure."
     },
     {
      "f": "{{Print}} the contents of the variable.",
      "k": {
       "Print": [
        "The <code>print()</code> function displays whatever you pass to it. Here the variable's name alone is enough, <b>without</b> quotes.",
        "print(msg)"
       ]
      },
      "c": "print(msg)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "Python is fun"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-2",
    "t": "Simple Messages",
    "orig": "Simple Messages",
    "lvl": 1,
    "tr": "Assign a message to a variable and print it. Then change the variable's value by assigning it a new message, and print the new message as well.",
    "steps": [
     {
      "f": "Create the {{msg}} variable with the first sentence.",
      "k": {
       "msg": [
        "The assignment you saw in 2-1: lowercase name, <code>=</code>, string in quotes.",
        "msg = \"I'm learning Python\""
       ]
      },
      "c": "msg = \"I'm learning Python\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "{{Print}} the message.",
      "k": {
       "Print": [
        "As in 2-1: print with the variable's name.",
        "print(msg)"
       ]
      },
      "c": "print(msg)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "I'm learning Python"
      ]
     },
     {
      "f": "{{Change}} the variable's value to a new message.",
      "k": {
       "Change": [
        "Reassigning a variable with <code>=</code> overwrites the previous value: Python always keeps track of the current value.",
        "msg = \"Python is powerful\""
       ]
      },
      "c": "msg = \"Python is powerful\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Print again: now the {{new value}} appears.",
      "k": {
       "new value": [
        "The same print now shows the updated contents: the variable is a label that now points to a different value.",
        "print(msg)"
       ]
      },
      "c": "print(msg)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "Python is powerful"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-3",
    "t": "Personal Message",
    "orig": "Personal Message",
    "lvl": 1,
    "tr": "Use a variable to represent a person's name, and print a message addressed to that person. The message should be simple, something like: <code>\"Hello Eric, would you like to learn some Python today?\"</code>",
    "steps": [
     {
      "f": "Create a {{name}} variable with a person's name.",
      "k": {
       "name": [
        "A short, descriptive variable name; the value is a string in quotes (single or double: Python doesn't care).",
        "name = \"eric\""
       ]
      },
      "c": "name = \"eric\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Print a {{personalized}} message by inserting the name into the sentence.",
      "k": {
       "personalized": [
        "Beware the ambiguity of \"printing\": a plain print isn't enough here. You need an <b>f-string</b>: the letter <code>f</code> before the quotes and the variable's name in curly braces <code>{ }</code>.",
        "print(f\"Hello {name}, would you like to learn some Python today?\")"
       ]
      },
      "c": "print(f\"Hello {name}, would you like to learn some Python today?\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Hello eric, would you like to learn some Python today?"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-4",
    "t": "Name Cases",
    "orig": "Name Cases",
    "lvl": 1,
    "tr": "Use a variable to represent a person's name, then print the name in lowercase, in UPPERCASE, and with the first letter of each word capitalized (title case).",
    "steps": [
     {
      "f": "Create the {{name}} variable with a two-word name, like \"ada lovelace\".",
      "k": {
       "name": [
        "Use a name with more than one word so you can see the effect of the three methods.",
        "name = \"ada lovelace\""
       ]
      },
      "c": "name = \"ada lovelace\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Print the name entirely in {{lowercase}}.",
      "k": {
       "lowercase": [
        "String methods are called with dot notation: <code>variable.method()</code>. <code>lower()</code> converts everything to lowercase; it doesn't modify the variable, it returns a new string.",
        "print(name.lower())"
       ]
      },
      "c": "print(name.lower())",
      "re": "^print\\s*\\(\\s*\\w+\\.lower\\(\\)\\s*\\)$",
      "so": [
       "ada lovelace"
      ]
     },
     {
      "f": "Print the name entirely in {{UPPERCASE}}.",
      "k": {
       "UPPERCASE": [
        "Same pattern as lower(), but with <code>upper()</code>.",
        "print(name.upper())"
       ]
      },
      "c": "print(name.upper())",
      "re": "^print\\s*\\(\\s*\\w+\\.upper\\(\\)\\s*\\)$",
      "so": [
       "ADA LOVELACE"
      ]
     },
     {
      "f": "Print the name with the {{iniziali maiuscole}}.",
      "k": {
       "iniziali maiuscole": [
        "The <code>title()</code> method capitalizes every word: handy for displaying names cleanly.",
        "print(name.title())"
       ]
      },
      "c": "print(name.title())",
      "re": "^print\\s*\\(\\s*\\w+\\.title\\(\\)\\s*\\)$",
      "so": [
       "Ada Lovelace"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-5",
    "t": "Famous Quote",
    "orig": "Famous Quote",
    "lvl": 1,
    "tr": "Find a quote from a famous person you admire. Print the quote and the name of its author. Your output should look something like this, quotation marks included:\n  <br><code>Albert Einstein: \"A person who never made a mistake never tried anything new.\"</code>",
    "steps": [
     {
      "f": "Write a {{print}} that includes the author and the quote in quotation marks.",
      "k": {
       "print": [
        "Again the ambiguity of \"printing\": here the trick is the quotation marks. To put quotation marks INSIDE a string, alternate the two kinds: double quotes outside and single quotes inside (or the other way around).",
        "print('Albert Einstein: \"A person who never…\"')"
       ]
      },
      "c": "print('Albert Einstein: \"A person who never made a mistake never tried anything new.\"')",
      "re": "^print\\s*\\(\\s*[\"'].{4,}[\"']\\s*\\)$",
      "so": [
       "Albert Einstein: \"A person who never made a mistake never tried anything new.\""
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-6",
    "t": "Famous Quote 2",
    "orig": "Famous Quote 2",
    "lvl": 1,
    "tr": "Repeat Exercise 2-5, but this time represent the famous person's name with a variable called <code>famous_person</code>. Then compose the message and represent it with a new variable called <code>message</code>. Print the message.",
    "steps": [
     {
      "f": "Create the {{famous_person}} variable with the author's name.",
      "k": {
       "famous_person": [
        "The book requires this exact name: two lowercase words separated by an underscore.",
        "famous_person = \"Albert Einstein\""
       ]
      },
      "c": "famous_person = \"Albert Einstein\"",
      "re": "^famous_person\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Compose the message in a {{message}} variable using an f-string.",
      "k": {
       "message": [
        "Composing the message in a variable first and printing it later makes the code more readable. In the f-string you can use double quotes inside, with the string delimited by single quotes.",
        "message = f'{famous_person} once said, \"…\"'"
       ]
      },
      "c": "message = f'{famous_person} once said, \"A person who never made a mistake never tried anything new.\"'",
      "re": "^message\\s*=\\s*f[\"'].*\\{\\s*famous_person\\s*\\}.*[\"']\\s*$"
     },
     {
      "f": "{{Print}} the message.",
      "k": {
       "Print": [
        "Now the print is trivial: print the ready-made variable.",
        "print(message)"
       ]
      },
      "c": "print(message)",
      "re": "^print\\s*\\(\\s*message\\s*\\)$",
      "so": [
       "Albert Einstein once said, \"A person who never made a mistake never tried anything new.\""
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-7",
    "t": "Stripping Names",
    "orig": "Stripping Names",
    "lvl": 2,
    "tr": "Use a variable to represent a person's name, and include some whitespace at the beginning and end of the name. Remember to use each character combination, <code>\\t</code> and <code>\\n</code>, at least once. Print the name once, so the whitespace is visible. Then print the name using each of the three stripping functions: <code>lstrip()</code>, <code>rstrip()</code>, and <code>strip()</code>.",
    "steps": [
     {
      "f": "Create the {{name}} variable with tabs and newlines around the name.",
      "k": {
       "name": [
        "<code>\\t</code> is a tab, <code>\\n</code> starts a new line: they're written INSIDE the quotes as two-character sequences (backslash + letter).",
        "name = \"\\tGrace Hopper\\n\""
       ]
      },
      "c": "name = \"\\tGrace Hopper\\n\"",
      "re": "^\\w+\\s*=\\s*[\"'].*(\\\\t|\\\\n).+[\"']\\s*$"
     },
     {
      "f": "Print the name {{as is}}: the whitespace will be visible.",
      "k": {
       "as is": [
        "A plain print shows the \"raw\" string: the tab appears as indentation and \\n moves the text to a new line.",
        "print(name)"
       ]
      },
      "c": "print(name)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "\\t␣Grace Hopper\\n"
      ]
     },
     {
      "f": "Print the name stripped {{left}}.",
      "k": {
       "left": [
        "<code>lstrip()</code> = <i>left strip</i>: removes spaces, tabs, and newlines only from the left side of the string. It doesn't modify the variable: call it at print time.",
        "print(name.lstrip())"
       ]
      },
      "c": "print(name.lstrip())",
      "re": "^print\\s*\\(\\s*\\w+\\.lstrip\\(\\)\\s*\\)$",
      "so": [
       "Grace Hopper"
      ],
      "note": "lstrip() only cleans the left side: the trailing \\n stays (that's why you'll see an empty line after the name, because print() adds its own newline)."
     },
     {
      "f": "Print the name stripped {{right}}.",
      "k": {
       "right": [
        "Same idea, but <code>rstrip()</code> works on the right side.",
        "print(name.rstrip())"
       ]
      },
      "c": "print(name.rstrip())",
      "re": "^print\\s*\\(\\s*\\w+\\.rstrip\\(\\)\\s*\\)$",
      "so": [
       "\\t␣Grace Hopper"
      ]
     },
     {
      "f": "Print the name stripped {{from both sides}}.",
      "k": {
       "from both sides": [
        "<code>strip()</code> cleans both ends at once: it's the most used one, for example to clean up user input.",
        "print(name.strip())"
       ]
      },
      "c": "print(name.strip())",
      "re": "^print\\s*\\(\\s*\\w+\\.strip\\(\\)\\s*\\)$",
      "so": [
       "Grace Hopper"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-8",
    "t": "File Extensions",
    "orig": "File Extensions",
    "lvl": 2,
    "tr": "Python has a <code>removesuffix()</code> method that works exactly like <code>removeprefix()</code>. Assign the value <code>'python_notes.txt'</code> to a variable called <code>filename</code>. Then use <code>removesuffix()</code> to display the filename without the extension, the way some file managers do.",
    "steps": [
     {
      "f": "Create the {{filename}} variable with the value the book gives.",
      "k": {
       "filename": [
        "The exact name required is filename, with the value 'python_notes.txt' (a string, so it goes in quotes).",
        "filename = \"python_notes.txt\""
       ]
      },
      "c": "filename = \"python_notes.txt\"",
      "re": "^filename\\s*=\\s*[\"']python_notes\\.txt[\"']\\s*$"
     },
     {
      "f": "Print the filename without the {{extension}}.",
      "k": {
       "extension": [
        "<code>removesuffix()</code> takes the suffix to remove in parentheses (here <code>'.txt'</code>) and returns the cleaned-up string: careful, it does NOT modify the variable.",
        "print(filename.removesuffix(\".txt\"))"
       ]
      },
      "c": "print(filename.removesuffix(\".txt\"))",
      "re": "^print\\s*\\(\\s*filename\\.removesuffix\\(\\s*[\"']\\.txt[\"']\\s*\\)\\s*\\)$",
      "so": [
       "python_notes"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-9",
    "t": "Number Eight",
    "orig": "Number Eight",
    "lvl": 1,
    "tr": "Write addition, subtraction, multiplication, and division operations that all result in 8. Wrap them in <code>print()</code> calls to see the results. You should see four lines, each with the number 8.",
    "steps": [
     {
      "f": "Write a {{sum}} whose result is 8, inside a print().",
      "k": {
       "sum": [
        "The <code>+</code> operator adds two numbers; print evaluates the expression and shows the result.",
        "print(5 + 3)"
       ]
      },
      "c": "print(5 + 3)",
      "re": "^print\\s*\\(\\s*\\d+\\s*\\+\\s*\\d+\\s*\\)$",
      "so": [
       "8"
      ]
     },
     {
      "f": "Write a {{subtraction}} that gives 8.",
      "k": {
       "subtraction": [
        "The <code>-</code> operator subtracts: choose two numbers whose difference is 8.",
        "print(10 - 2)"
       ]
      },
      "c": "print(10 - 2)",
      "re": "^print\\s*\\(\\s*\\d+\\s*-\\s*\\d+\\s*\\)$",
      "so": [
       "8"
      ]
     },
     {
      "f": "Write a {{multiplication}} that gives 8.",
      "k": {
       "multiplication": [
        "The <code>*</code> operator multiplies.",
        "print(4 * 2)"
       ]
      },
      "c": "print(4 * 2)",
      "re": "^print\\s*\\(\\s*\\d+\\s*\\*\\s*\\d+\\s*\\)$",
      "so": [
       "8"
      ]
     },
     {
      "f": "Write a {{division}} that gives 8.",
      "k": {
       "division": [
        "Watch out: <code>/</code> in Python ALWAYS returns a float, so you'll see <code>8.0</code>, not 8.",
        "print(16 / 2)"
       ]
      },
      "c": "print(16 / 2)",
      "re": "^print\\s*\\(\\s*\\d+\\s*/\\s*\\d+\\s*\\)$",
      "so": [
       "8.0"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-10",
    "t": "Favorite Number",
    "orig": "Favorite Number",
    "lvl": 1,
    "tr": "Use a variable to represent your favorite number. Then, using that variable, create a message that reveals your favorite number. Print the message.",
    "steps": [
     {
      "f": "Create the {{number}} variable with your favorite number.",
      "k": {
       "number": [
        "Numbers are NOT written in quotes: 7 is an integer, \"7\" would be a string.",
        "number = 7"
       ]
      },
      "c": "number = 7",
      "re": "^\\w+\\s*=\\s*\\d+\\s*$"
     },
     {
      "f": "Create the {{msg}} with an f-string that includes the number.",
      "k": {
       "msg": [
        "As with the personalized sentences: f before the quotes and <code>{number}</code> in curly braces. The number is converted to text automatically.",
        "msg = f\"My favorite number is {number}.\""
       ]
      },
      "c": "msg = f\"My favorite number is {number}.\"",
      "re": "^\\w+\\s*=\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*$"
     },
     {
      "f": "{{Print}} the message.",
      "k": {
       "Print": [
        "Printing the variable, which should be familiar by now.",
        "print(msg)"
       ]
      },
      "c": "print(msg)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "My favorite number is 7."
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-11",
    "t": "Adding Comments",
    "orig": "Adding Comments",
    "lvl": 1,
    "tr": "Choose two of the programs you've written and add at least one comment to each. If you have nothing specific to write because the programs are still simple, add your name and the current date at the top of each file. Then write one sentence describing what the program does.",
    "steps": [
     {
      "f": "Write a {{comment}} at the top of the program with your name and the date.",
      "k": {
       "comment": [
        "In Python comments start with <code>#</code>: everything that follows on the line is ignored by the interpreter.",
        "# Author: Maria Rossi — 04/11/2026"
       ]
      },
      "c": "# Author: Maria Rossi — 04/11/2026",
      "re": "^#.*$",
      "raw": true
     },
     {
      "f": "Add a comment that {{describes}} the program, then the actual code.",
      "k": {
       "describes": [
        "A good comment explains WHAT the code does and WHY, without restating the syntax. Remember: code is read more often than it is written.",
        "# Print a personalized greeting\nprint(\"Hello Python!\")"
       ]
      },
      "c": "# Print a personalized greeting\nprint(\"Hello Python!\")",
      "re": [
       "^#.*$",
       "^print\\s*\\(.*\\)$"
      ],
      "raw": true,
      "so": [
       "Hello Python!"
      ]
     }
    ],
    "ch": 2
   },
   {
    "id": "2-12",
    "t": "Zen of Python",
    "orig": "Zen of Python",
    "lvl": 1,
    "tr": "Type <code>import this</code> in a Python terminal session and browse through the additional maxims.",
    "steps": [
     {
      "f": "Write the statement that {{importa}} the <code>this</code> module.",
      "k": {
       "importa": [
        "<code>import</code> loads a module: just the keyword followed by the name, no parentheses or quotes needed. <code>this</code> is an \"easter egg\" module carrying the language's philosophy.",
        "import this"
       ]
      },
      "c": "import this",
      "re": "^import\\s+this\\s*$",
      "so": [
       "The Zen of Python, by Tim Peters",
       " ",
       "Beautiful is better than ugly.",
       "Simple is better than complex.",
       "Readability counts.",
       "…"
      ]
     },
     {
      "f": "Which {{maxim}} strikes you the most? Why?",
      "k": {
       "maxim": [
        "For example, \"Simple is better than complex\": when two solutions both work, choose the simpler one.",
        "\"Readability counts.\""
       ]
      },
      "c": null,
      "ta": "Write the maxim and a short comment (min 15 characters)…",
      "min": 15
     }
    ],
    "ch": 2
   }
  ]
 },
 {
  "n": 3,
  "t": "Introducing Lists",
  "sub": "Lists, indices, and core methods",
  "concepts": [
   "Lists: ordered collections in square brackets",
   "Indices start at 0 (−1 = last item)",
   "Adding: append(), insert() — Removing: del, pop(), remove()",
   "Sorting: sort(), sorted(), reverse() — Counting: len()",
   "Index errors and counting from one"
  ],
  "ex": [
   {
    "id": "3-1",
    "t": "Names",
    "orig": "Names",
    "lvl": 1,
    "tr": "Store the names of a few friends in a list called <code>names</code>. Print each person's name by accessing each element in the list, one at a time.",
    "steps": [
     {
      "f": "Create a list called {{names}} with the names of a few friends.",
      "k": {
       "names": [
        "Lists are defined with square brackets and elements separated by commas (strings in quotes). A plural name reminds you that it holds multiple values.",
        "names = [\"marie\", \"alan\", \"ada\"]"
       ]
      },
      "c": "names = [\"marie\", \"alan\", \"ada\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print the {{first}} name using its index.",
      "k": {
       "first": [
        "Indices start at 0, not 1: the first element is <code>list[0]</code>.",
        "print(names[0])"
       ]
      },
      "c": "print(names[0])",
      "re": "^print\\s*\\(\\s*\\w+\\[0\\]\\s*\\)$",
      "so": [
       "marie"
      ]
     },
     {
      "f": "Print the {{second}} name.",
      "k": {
       "second": [
        "The second element has index 1: the classic \"off-by-one\" error.",
        "print(names[1])"
       ]
      },
      "c": "print(names[1])",
      "re": "^print\\s*\\(\\s*\\w+\\[1\\]\\s*\\)$",
      "so": [
       "alan"
      ]
     },
     {
      "f": "Print the {{third}} name.",
      "k": {
       "third": [
        "The third element has index 2: the position minus one.",
        "print(names[2])"
       ]
      },
      "c": "print(names[2])",
      "re": "^print\\s*\\(\\s*\\w+\\[2\\]\\s*\\)$",
      "so": [
       "ada"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-2",
    "t": "Greetings",
    "orig": "Greetings",
    "lvl": 1,
    "tr": "Start with the list from Exercise 3-1, but instead of just printing each person's name, print a message to each of them. The text of each message should be the same, but personalized with the person's name.",
    "steps": [
     {
      "f": "Recreate the {{names}} list of friends.",
      "k": {
       "names": [
        "Three names are enough: separate them with commas, each one in quotes.",
        "names = [\"marie\", \"alan\", \"ada\"]"
       ]
      },
      "c": "names = [\"marie\", \"alan\", \"ada\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print a message for the first name, inserting it with an {{indexed f-string}}.",
      "k": {
       "indexed f-string": [
        "Inside the braces of an f-string you can put any expression, even a list element: <code>{names[0]}</code>.",
        "print(f\"Hi {names[0]}, how are you?\")"
       ]
      },
      "c": "print(f\"Hi {names[0]}, how are you?\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\]\\s*\\}.*[\"']\\s*\\)$",
      "so": [
       "Hi marie, how are you?"
      ]
     },
     {
      "f": "Repeat the {{personalized}} greeting for the second name.",
      "k": {
       "personalized": [
        "Same print, but with index 1.",
        "print(f\"Hi {names[1]}, how are you?\")"
       ]
      },
      "c": "print(f\"Hi {names[1]}, how are you?\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[1\\]\\s*\\}.*[\"']\\s*\\)$",
      "so": [
       "Hi alan, how are you?"
      ]
     },
     {
      "f": "And for the {{third}} name.",
      "k": {
       "third": [
        "Index 2: that completes all your friends.",
        "print(f\"Hi {names[2]}, how are you?\")"
       ]
      },
      "c": "print(f\"Hi {names[2]}, how are you?\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[2\\]\\s*\\}.*[\"']\\s*\\)$",
      "so": [
       "Hi ada, how are you?"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-3",
    "t": "Your Own List",
    "orig": "Your Own List",
    "lvl": 1,
    "tr": "Think of your favorite mode of transportation, such as a motorcycle or a car, and make a list that stores a few examples. Use your list to print a series of statements about these items, such as: <code>\"I would like to own a Honda motorcycle.\"</code>",
    "steps": [
     {
      "f": "Create the {{vehicles}} list with a few vehicles you like.",
      "k": {
       "vehicles": [
        "The list can contain any strings: motorcycle models, cars, bikes…",
        "vehicles = [\"honda hornet\", \"tesla\", \"bianchi\"]"
       ]
      },
      "c": "vehicles = [\"honda hornet\", \"tesla\", \"bianchi\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)*\\]$"
     },
     {
      "f": "Print a statement about the {{first element}}.",
      "k": {
       "first element": [
        "Combine an f-string, an index, and maybe the <code>.title()</code> method for cleaner output.",
        "print(f\"I would like to own a {vehicles[0].title()} motorcycle.\")"
       ]
      },
      "c": "print(f\"I would like to own a {vehicles[0].title()} motorcycle.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "I would like to own a Honda Hornet motorcycle."
      ]
     },
     {
      "f": "Print a statement about the {{second element}}.",
      "k": {
       "second element": [
        "Index 1, with a sentence that fits the type of vehicle.",
        "print(f\"I would like to own a {vehicles[1].title()} car.\")"
       ]
      },
      "c": "print(f\"I would like to own a {vehicles[1].title()} car.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[1\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "I would like to own a Tesla car."
      ]
     },
     {
      "f": "Print a statement about the {{third element}}.",
      "k": {
       "third element": [
        "Index 2 — or −1, which always refers to the last element!",
        "print(f\"I would like to own a {vehicles[2].title()} bike.\")"
       ]
      },
      "c": "print(f\"I would like to own a {vehicles[2].title()} bike.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[2\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "I would like to own a Bianchi bike."
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-4",
    "t": "Guest List",
    "orig": "Guest List",
    "lvl": 1,
    "tr": "If you could invite anyone to dinner, living or deceased, who would you invite? Make a list that includes at least three people you'd like to invite. Then use your list to print an invitation to dinner for each of them.",
    "steps": [
     {
      "f": "Create the {{guests}} list with at least three people.",
      "k": {
       "guests": [
        "The usual structure: square brackets, strings in quotes, commas.",
        "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]"
       ]
      },
      "c": "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print the {{invitation}} for the first person.",
      "k": {
       "invitation": [
        "An f-string with the element at index 0: the sentence should be a dinner invitation.",
        "print(f\"{guests[0].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[0].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Marie Curie, you're invited to dinner at my place!"
      ]
     },
     {
      "f": "Print the invitation for the {{second person}}.",
      "k": {
       "second person": [
        "Index 1, same structure.",
        "print(f\"{guests[1].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[1].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[1\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Alan Turing, you're invited to dinner at my place!"
      ]
     },
     {
      "f": "Print the invitation for the {{third person}}.",
      "k": {
       "third person": [
        "Index 2, and the whole list has been invited.",
        "print(f\"{guests[2].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[2].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[2\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Ada Lovelace, you're invited to dinner at my place!"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-5",
    "t": "Changing Guest List",
    "orig": "Changing Guest List",
    "lvl": 2,
    "tr": "You just found out that one of your guests can't make it to dinner, so you need to send out a new round of invitations.\n  <ul><li>Start with your program from Exercise 3-4: add a <code>print()</code> stating the name of the guest who can't make it.</li>\n  <li>Modify the list, replacing the name of the guest who can't make it with the name of the new person you're inviting.</li>\n  <li>Print a second round of invitations, one for each person still on the list.</li></ul>",
    "steps": [
     {
      "f": "Recreate the {{guests}} list with at least three names.",
      "k": {
       "guests": [
        "Let's start from the program in 3-4.",
        "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]"
       ]
      },
      "c": "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print the name of the guest who {{can't make it}}.",
      "k": {
       "can't make it": [
        "Any print that mentions the missing guest.",
        "print(\"Unfortunately alan turing can't make it.\")"
       ]
      },
      "c": "print(\"Unfortunately alan turing can't make it.\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "Unfortunately alan turing can't make it."
      ]
     },
     {
      "f": "Use an index to {{replace}} the missing guest with a new invitee.",
      "k": {
       "replace": [
        "You change an element by assigning to its position: <code>list[index] = new_value</code>. Here the missing guest is at index 1.",
        "guests[1] = \"linus torvalds\""
       ]
      },
      "c": "guests[1] = \"linus torvalds\"",
      "re": "^\\w+\\[\\d+\\]\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Print the new invitation for the {{first person}}.",
      "k": {
       "first person": [
        "Same as in 3-4, but now the list is up to date.",
        "print(f\"{guests[0].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[0].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Marie Curie, you're invited to dinner at my place!"
      ]
     },
     {
      "f": "Print the invitation for the {{new guest}} (index 1).",
      "k": {
       "new guest": [
        "Index 1 now holds the person you just added.",
        "print(f\"{guests[1].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[1].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[1\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Linus Torvalds, you're invited to dinner at my place!"
      ]
     },
     {
      "f": "Print the invitation for the {{third person}}.",
      "k": {
       "third person": [
        "Index 2, unchanged.",
        "print(f\"{guests[2].title()}, you're invited to dinner at my place!\")"
       ]
      },
      "c": "print(f\"{guests[2].title()}, you're invited to dinner at my place!\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[2\\][^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Ada Lovelace, you're invited to dinner at my place!"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-6",
    "t": "More Guests",
    "orig": "More Guests",
    "lvl": 2,
    "tr": "You just found a bigger table, so now there's room for more guests! Think of three more people to invite.\n  <ul><li>Start with your program from Exercise 3-4 or 3-5: add a <code>print()</code> announcing that you found a bigger table.</li>\n  <li>Use <code>insert()</code> to add a new guest to the beginning of the list.</li>\n  <li>Use <code>insert()</code> to add another one to the middle of the list.</li>\n  <li>Use <code>append()</code> to add a third one at the end.</li>\n  <li>Print a new round of invitations, one for each person.</li></ul>",
    "steps": [
     {
      "f": "Start again from the {{guests}} list.",
      "k": {
       "guests": [
        "Three names are enough as a starting point.",
        "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]"
       ]
      },
      "c": "guests = [\"marie curie\", \"alan turing\", \"ada lovelace\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Announce that you found a {{bigger table}}.",
      "k": {
       "bigger table": [
        "Any print with the good news.",
        "print(\"I found a bigger table: more room for everyone!\")"
       ]
      },
      "c": "print(\"I found a bigger table: more room for everyone!\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "I found a bigger table: more room for everyone!"
      ]
     },
     {
      "f": "Add a guest {{at the beginning}} of the list.",
      "k": {
       "at the beginning": [
        "<code>insert(position, value)</code> opens a space at that position and shifts everything else to the right: insert(0, …) puts the item at the beginning.",
        "guests.insert(0, \"grace hopper\")"
       ]
      },
      "c": "guests.insert(0, \"grace hopper\")",
      "re": "^\\w+\\.insert\\(\\s*0\\s*,\\s*[\"'].+[\"']\\s*\\)$"
     },
     {
      "f": "Add another guest {{halfway}} through the list.",
      "k": {
       "halfway": [
        "With 4 elements, the \"middle\" is index 2: insert(2, …). The position is up to you: count the elements you have right now.",
        "guests.insert(2, \"guido van rossum\")"
       ]
      },
      "c": "guests.insert(2, \"guido van rossum\")",
      "re": "^\\w+\\.insert\\(\\s*\\d+\\s*,\\s*[\"'].+[\"']\\s*\\)$",
      "note": "The list now has 5 people."
     },
     {
      "f": "Add a third guest {{at the end}}.",
      "k": {
       "at the end": [
        "<code>append()</code> always adds to the end: it's the most common way to grow a list, one element at a time.",
        "guests.append(\"barbara liskov\")"
       ]
      },
      "c": "guests.append(\"barbara liskov\")",
      "re": "^\\w+\\.append\\(\\s*[\"'].+[\"']\\s*\\)$"
     },
     {
      "f": "Print a new round of {{invitations}} for three people of your choice (first, middle, and last).",
      "k": {
       "invitations": [
        "Three prints with f-strings and indices (0, 2, and −1). The index −1 is handy: it's ALWAYS the last element.",
        "print(f\"{guests[0].title()}, come have dinner with me!\")\nprint(f\"{guests[2].title()}, come have dinner with me!\")\nprint(f\"{guests[-1].title()}, come have dinner with me!\")"
       ]
      },
      "c": "print(f\"{guests[0].title()}, come have dinner with me!\")\nprint(f\"{guests[2].title()}, come have dinner with me!\")\nprint(f\"{guests[-1].title()}, come have dinner with me!\")",
      "re": [
       "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\][^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[2\\][^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[-1\\][^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Grace Hopper, come have dinner with me!",
       "Guido Van Rossum, come have dinner with me!",
       "Barbara Liskov, come have dinner with me!"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-7",
    "t": "Shrinking Guest List",
    "orig": "Shrinking Guest List",
    "lvl": 2,
    "tr": "You just found out that your new table won't arrive in time for dinner, and now you only have room for two guests.\n  <ul><li>Start with your program from Exercise 3-6: add a line that prints a message saying you can only invite two people to dinner.</li>\n  <li>Use <code>pop()</code> to remove guests one at a time until only two names are left; each time you pop a name, print an apology message to that person.</li>\n  <li>Print a message to the two people still on the list, confirming that they're still invited.</li>\n  <li>Use <code>del</code> to remove the last two names, leaving you with an empty list. Print the list to verify.</li></ul>",
    "steps": [
     {
      "f": "Recreate the {{guests}} list with five people.",
      "k": {
       "guests": [
        "Five names: this way we'll have to pop three of them.",
        "guests = [\"marie\", \"alan\", \"ada\", \"linus\", \"grace\"]"
       ]
      },
      "c": "guests = [\"marie\", \"alan\", \"ada\", \"linus\", \"grace\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Announce that you can only invite {{two people}}.",
      "k": {
       "two people": [
        "A print with the bad news.",
        "print(\"The new table won't arrive in time: only two seats!\")"
       ]
      },
      "c": "print(\"The new table won't arrive in time: only two seats!\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "The new table won't arrive in time: only two seats!"
      ]
     },
     {
      "f": "Remove the last guest with {{pop()}} and apologize.",
      "k": {
       "pop()": [
        "<code>pop()</code> removes the last element and RETURNS it: you can save it in a variable and use it in the apology message.",
        "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")"
       ]
      },
      "c": "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "I'm sorry Grace, but dinner is cancelled."
      ]
     },
     {
      "f": "Remove and say goodbye to a {{second excluded guest}}.",
      "k": {
       "second excluded guest": [
        "pop() again: this time it's Linus.",
        "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")"
       ]
      },
      "c": "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "I'm sorry Linus, but dinner is cancelled."
      ]
     },
     {
      "f": "Remove and say goodbye to the {{third excluded guest}}: two guests are left.",
      "k": {
       "third excluded guest": [
        "The last pop(): the list goes down to two elements.",
        "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")"
       ]
      },
      "c": "name = guests.pop()\nprint(f\"I'm sorry {name.title()}, but dinner is cancelled.\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "I'm sorry Ada, but dinner is cancelled."
      ]
     },
     {
      "f": "Confirm to the {{two remaining guests}} that they're still invited.",
      "k": {
       "two remaining guests": [
        "Two prints: indices 0 and 1 (or 0 and −1).",
        "print(f\"{guests[0].title()}, you're still invited!\")\nprint(f\"{guests[1].title()}, you're still invited!\")"
       ]
      },
      "c": "print(f\"{guests[0].title()}, you're still invited!\")\nprint(f\"{guests[1].title()}, you're still invited!\")",
      "re": [
       "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[0\\][^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{\\s*\\w+\\[1\\][^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Marie, you're still invited!",
       "Alan, you're still invited!"
      ]
     },
     {
      "f": "Use del to {{empty}} the list, then print it.",
      "k": {
       "empty": [
        "<code>del list[index]</code> deletes by position and does NOT return anything. Repeated twice on index 0, it empties the list.",
        "del guests[0]\ndel guests[0]\nprint(guests)"
       ]
      },
      "c": "del guests[0]\ndel guests[0]\nprint(guests)",
      "re": [
       "^del\\s+\\w+\\[\\d+\\]\\s*$",
       "^del\\s+\\w+\\[\\d+\\]\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "[]"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-8",
    "t": "Seeing the World",
    "orig": "Seeing the World",
    "lvl": 2,
    "tr": "Think of at least five places in the world you'd like to visit.\n  <ul><li>Store the locations in a list (not in alphabetical order).</li>\n  <li>Print the list in its original order, exactly as it is.</li>\n  <li>Use <code>sorted()</code> to print it in alphabetical order without changing the original list.</li>\n  <li>Show that the list is still in its original order by printing it again.</li>\n  <li>Use <code>sorted()</code> to print it in reverse alphabetical order, again without changing it.</li>\n  <li>Show once more that the original order is intact.</li>\n  <li>Use <code>reverse()</code> to reverse the order of the list. Print it to confirm the order has changed.</li>\n  <li>Use <code>reverse()</code> again to get back to the original order. Print it.</li>\n  <li>Use <code>sort()</code> to save the list in alphabetical order. Print it.</li>\n  <li>Use <code>sort()</code> with <code>reverse=True</code> for reverse alphabetical order. Print it.</li></ul>",
    "steps": [
     {
      "f": "Create the {{locations}} list with five destinations (not in alphabetical order).",
      "k": {
       "locations": [
        "As always: square brackets, strings, commas.",
        "locations = [\"tokyo\", \"reykjavik\", \"patagonia\", \"kyoto\", \"norvegia\"]"
       ]
      },
      "c": "locations = [\"tokyo\", \"reykjavik\", \"patagonia\", \"kyoto\", \"norvegia\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print the list in its {{original order}}.",
      "k": {
       "original order": [
        "Print the variable just as it is: lists display with brackets and quotes, which is fine for now.",
        "print(locations)"
       ]
      },
      "c": "print(locations)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'kyoto', 'norvegia']"
      ]
     },
     {
      "f": "Print the list in {{alphabetical}} order without actually changing it.",
      "k": {
       "alphabetical": [
        "<code>sorted()</code> is a FUNCTION: it returns a sorted copy and leaves the list intact. Don't confuse it with sort(), which changes the list for good.",
        "print(sorted(locations))"
       ]
      },
      "c": "print(sorted(locations))",
      "re": "^print\\s*\\(\\s*sorted\\(\\s*\\w+\\s*\\)\\s*\\)$",
      "so": [
       "['kyoto', 'norvegia', 'patagonia', 'reykjavik', 'tokyo']"
      ]
     },
     {
      "f": "Show that the original is {{intact}}: print the list again.",
      "k": {
       "intact": [
        "The same print as before: the order is still the order of insertion, proof that sorted() didn't touch anything.",
        "print(locations)"
       ]
      },
      "c": "print(locations)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'kyoto', 'norvegia']"
      ]
     },
     {
      "f": "Print the list in {{reverse}} alphabetical order (sorted).",
      "k": {
       "reverse": [
        "sorted() accepts the <code>reverse=True</code> argument for the opposite order — still without touching the original.",
        "print(sorted(locations, reverse=True))"
       ]
      },
      "c": "print(sorted(locations, reverse=True))",
      "re": "^print\\s*\\(\\s*sorted\\(\\s*\\w+\\s*,\\s*reverse\\s*=\\s*True\\s*\\)\\s*\\)$",
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'norvegia', 'kyoto']"
      ]
     },
     {
      "f": "Show the {{original}} order once more.",
      "k": {
       "original": [
        "Still intact.",
        "print(locations)"
       ]
      },
      "c": "print(locations)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'kyoto', 'norvegia']"
      ]
     },
     {
      "f": "Use {{reverse()}} to actually reverse the order, and print it.",
      "k": {
       "reverse()": [
        "Watch out for the \"false friend\": reverse() does NOT sort backwards — it flips the insertion order (first↔last), and it does so permanently.",
        "locations.reverse()\nprint(locations)"
       ]
      },
      "c": "locations.reverse()\nprint(locations)",
      "re": [
       "^\\w+\\.reverse\\(\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "['norvegia', 'kyoto', 'patagonia', 'reykjavik', 'tokyo']"
      ]
     },
     {
      "f": "Use {{reverse()}} a second time to get back to the original order, and print it.",
      "k": {
       "reverse()": [
        "Reversing twice cancels out the reversal.",
        "locations.reverse()\nprint(locations)"
       ]
      },
      "c": "locations.reverse()\nprint(locations)",
      "re": [
       "^\\w+\\.reverse\\(\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'kyoto', 'norvegia']"
      ]
     },
     {
      "f": "Use {{sort()}} for a permanent alphabetical sort, and print it.",
      "k": {
       "sort()": [
        "<code>sort()</code> is a METHOD: it reorders the list in place, for good. The original order is lost.",
        "locations.sort()\nprint(locations)"
       ]
      },
      "c": "locations.sort()\nprint(locations)",
      "re": [
       "^\\w+\\.sort\\(\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "['kyoto', 'norvegia', 'patagonia', 'reykjavik', 'tokyo']"
      ]
     },
     {
      "f": "Use sort() with {{reverse=True}} for reverse alphabetical order, and print it.",
      "k": {
       "reverse=True": [
        "sort() accepts reverse=True as well. Now the exercise is complete: you've used sorted, sort, and reverse!",
        "locations.sort(reverse=True)\nprint(locations)"
       ]
      },
      "c": "locations.sort(reverse=True)\nprint(locations)",
      "re": [
       "^\\w+\\.sort\\(\\s*reverse\\s*=\\s*True\\s*\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "['tokyo', 'reykjavik', 'patagonia', 'norvegia', 'kyoto']"
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-9",
    "t": "Dinner Guests",
    "orig": "Dinner Guests",
    "lvl": 1,
    "tr": "Working with one of the programs from Exercises 3-4 through 3-7, use <code>len()</code> to print a message indicating how many people you're inviting to dinner.",
    "steps": [
     {
      "f": "Create the {{guests}} list to start from.",
      "k": {
       "guests": [
        "Three guests are enough.",
        "guests = [\"marie\", \"alan\", \"ada\"]"
       ]
      },
      "c": "guests = [\"marie\", \"alan\", \"ada\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)*\\]$"
     },
     {
      "f": "Print a message with the {{number}} of guests using len().",
      "k": {
       "number": [
        "<code>len()</code> returns how many elements a list has. You can put it directly inside the braces of an f-string.",
        "print(f\"I'm inviting {len(guests)} people to dinner.\")"
       ]
      },
      "c": "print(f\"I'm inviting {len(guests)} people to dinner.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*len\\(\\s*\\w+\\s*\\)\\s*\\}.*[\"']\\s*\\)$",
      "so": [
       "I'm inviting 3 people to dinner."
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-10",
    "t": "Every Function",
    "orig": "Every Function",
    "lvl": 2,
    "tr": "Think of things you could store in a list: mountains, rivers, countries, cities, languages, or anything else you like. Write a program that creates a list containing these items and then uses <b>every function introduced in this chapter</b> at least once.",
    "steps": [
     {
      "f": "Create the {{cities}} list with a few elements.",
      "k": {
       "cities": [
        "Start with 3-4 elements: you'll make it grow and shrink.",
        "cities = [\"roma\", \"milano\", \"napoli\"]"
       ]
      },
      "c": "cities = [\"roma\", \"milano\", \"napoli\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)*\\]$"
     },
     {
      "f": "Use {{append()}} to add an element at the end, then print a confirmation.",
      "k": {
       "append()": [
        "It adds to the end.",
        "cities.append(\"torino\")"
       ]
      },
      "c": "cities.append(\"torino\")\nprint(\"Appended at the end: torino\")",
      "re": [
       "^\\w+\\.append\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*[\"']Appended at the end: [^\"']+[\"']\\s*\\)$"
      ],
      "so": [
       "Appended at the end: torino"
      ]
     },
     {
      "f": "Use {{insert()}} to add an element at a specific position, then print a confirmation.",
      "k": {
       "insert()": [
        "insert(index, value): it opens a slot at the given position.",
        "cities.insert(1, \"bologna\")"
       ]
      },
      "c": "cities.insert(1, \"bologna\")\nprint(\"Inserted at position 1: bologna\")",
      "re": [
       "^\\w+\\.insert\\(\\s*\\d+\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*[\"']Inserted at position \\d+: [^\"']+[\"']\\s*\\)$"
      ],
      "so": [
       "Inserted at position 1: bologna"
      ]
     },
     {
      "f": "Use the {{del}} statement to delete an element by index, then print a confirmation.",
      "k": {
       "del": [
        "del deletes by position and returns nothing.",
        "del cities[0]"
       ]
      },
      "c": "del cities[0]\nprint(\"Deleted element 0\")",
      "re": [
       "^del\\s+\\w+\\[\\d+\\]\\s*$",
       "^print\\s*\\(\\s*[\"']Deleted element \\d+[\"']\\s*\\)$"
      ],
      "so": [
       "Deleted element 0"
      ]
     },
     {
      "f": "Use {{pop()}} to remove the last element, save it, and print which city was removed.",
      "k": {
       "pop()": [
        "Pop returns the removed element: save it in a variable.",
        "last = cities.pop()"
       ]
      },
      "c": "last = cities.pop()\nprint(\"Removed the last city:\")\nprint(last)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*[\"']Removed the last city:[\"']\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "Removed the last city:",
       "torino"
      ]
     },
     {
      "f": "Use {{remove()}} to remove an element by value, then print a confirmation.",
      "k": {
       "remove()": [
        "remove takes out the FIRST occurrence of the given value: you need the value, not the index.",
        "cities.remove(\"milano\")"
       ]
      },
      "c": "cities.remove(\"milano\")\nprint(\"Removed by value: milano\")",
      "re": [
       "^\\w+\\.remove\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*[\"']Removed by value: [^\"']+[\"']\\s*\\)$"
      ],
      "so": [
       "Removed by value: milano"
      ]
     },
     {
      "f": "Use {{sort()}} for a permanent alphabetical sort, then print a confirmation.",
      "k": {
       "sort()": [
        "It sorts in place, for good.",
        "cities.sort()"
       ]
      },
      "c": "cities.sort()\nprint(\"Permanent sort applied\")",
      "re": [
       "^\\w+\\.sort\\(\\)\\s*$",
       "^print\\s*\\(\\s*[\"']Permanent sort applied[\"']\\s*\\)$"
      ],
      "so": [
       "Permanent sort applied"
      ]
     },
     {
      "f": "Use {{sorted()}} for a temporary sort (just for printing).",
      "k": {
       "sorted()": [
        "The function returns a sorted copy without touching the list.",
        "print(sorted(cities))"
       ]
      },
      "c": "print(sorted(cities))",
      "re": "^print\\s*\\(\\s*sorted\\(\\s*\\w+\\s*\\)\\s*\\)$",
      "so": [
       "['bologna', 'napoli']"
      ]
     },
     {
      "f": "Use {{reverse()}} to reverse the insertion order, then print a confirmation.",
      "k": {
       "reverse()": [
        "It reverses, it doesn't sort.",
        "cities.reverse()"
       ]
      },
      "c": "cities.reverse()\nprint(\"Order reversed\")",
      "re": [
       "^\\w+\\.reverse\\(\\)\\s*$",
       "^print\\s*\\(\\s*[\"']Order reversed[\"']\\s*\\)$"
      ],
      "so": [
       "Order reversed"
      ]
     },
     {
      "f": "Use {{len()}} to print how many elements the list contains.",
      "k": {
       "len()": [
        "It counts the elements: here Python starts counting from one — no off-by-one!",
        "print(f\"The list has {len(cities)} cities.\")"
       ]
      },
      "c": "print(f\"The list has {len(cities)} cities.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{\\s*len\\(\\s*\\w+\\s*\\)\\s*\\}.*[\"']\\s*\\)$",
      "so": [
       "The list has 2 cities."
      ]
     }
    ],
    "ch": 3
   },
   {
    "id": "3-11",
    "t": "Intentional Error",
    "orig": "Intentional Error",
    "lvl": 1,
    "tr": "If you haven't received an index error in any of your programs yet, try to make one happen! Change an index in one of your programs to produce an index error. Make sure you correct the error before closing the program.",
    "steps": [
     {
      "f": "Create the {{motorcycles}} list with three elements.",
      "k": {
       "motorcycles": [
        "Three elements = valid indices from 0 to 2 (and from −1 to −3).",
        "motorcycles = [\"honda\", \"yamaha\", \"suzuki\"]"
       ]
      },
      "c": "motorcycles = [\"honda\", \"yamaha\", \"suzuki\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Watch the {{error}}: open the Sandbox and ask for index 3.",
      "k": {
       "error": [
        "A list of three elements only goes up to index 2: asking for index 3 is the classic off-by-one error. Open the <b>Sandbox</b> panel, paste <code>motorcycles = [\"honda\", \"yamaha\", \"suzuki\"]</code> and <code>print(motorcycles[3])</code>, then press Run: you'll see the traceback with the IndexError.",
        "print(motorcycles[3])  # IndexError!"
       ]
      },
      "c": null,
      "btn": "✓ Error observed in the Sandbox",
      "note": "The line that causes the error does NOT go into the exercise program: in the next step you'll fix it using the index -1."
     },
     {
      "f": "Fix it using the index {{-1}}, which always points to the last element.",
      "k": {
       "-1": [
        "The index −1 always works, whatever the current length of the list: it's the \"safe\" way to access the last element.",
        "print(motorcycles[-1])"
       ]
      },
      "c": "print(motorcycles[-1])",
      "re": "^print\\s*\\(\\s*\\w+\\[-1\\]\\s*\\)$",
      "so": [
       "suzuki"
      ]
     }
    ],
    "ch": 3
   }
  ]
 },
 {
  "n": 4,
  "t": "Working with Lists",
  "sub": "For loops, range, slices, tuples, and PEP 8",
  "concepts": [
   "The for loop and the temporary variable",
   "Indentation defines the blocks",
   "range(), statistics (min, max, sum), and list comprehensions",
   "Slices and copying lists",
   "Tuples: immutable lists",
   "PEP 8 style guidelines"
  ],
  "ex": [
   {
    "id": "4-1",
    "t": "Pizzas",
    "orig": "Pizzas",
    "lvl": 1,
    "tr": "Think of at least three kinds of pizza you like. Store the names in a list, and use a <code>for</code> loop to print the name of each one.\n  <ul><li>Modify the <code>for</code> loop to print a sentence using the name of the pizza, instead of just the name. For each pizza you should get a line like <code>I like pepperoni pizza</code>.</li>\n  <li>Add a line at the end of your program, <b>outside</b> the for loop, stating how much you like pizza. The final output should contain three or more sentences about the kinds of pizza, followed by the extra sentence, like <code>I really love pizza!</code></li></ul>",
    "steps": [
     {
      "f": "Create the list {{pizzas}} with at least three kinds.",
      "k": {
       "pizzas": [
        "As always: square brackets and strings.",
        "pizzas = [\"margherita\", \"pepperoni\", \"hawaiian\"]"
       ]
      },
      "c": "pizzas = [\"margherita\", \"pepperoni\", \"hawaiian\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Write the {{header}} of a for loop that visits each pizza.",
      "k": {
       "header": [
        "The for line contains: the keyword <code>for</code>, a temporary name in the SINGULAR, the word <code>in</code>, the list name in the plural, and a colon at the end.",
        "for pizza in pizzas:"
       ]
      },
      "c": "for pizza in pizzas:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "In the loop body, {{print}} a sentence using the pizza's name.",
      "k": {
       "print": [
        "Everything INSIDE the loop is indented 4 spaces: it will be repeated for each element. Use the temporary name in the f-string.",
        "    print(f\"I like {pizza} pizza.\")"
       ]
      },
      "c": "    print(f\"I like {pizza} pizza.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "I like margherita pizza.",
       "I like pepperoni pizza.",
       "I like hawaiian pizza."
      ]
     },
     {
      "f": "Outside the loop, {{not indented}}, print how much you love pizza.",
      "k": {
       "not indented": [
        "The final line is NOT indented: it runs just once, after the loop. If you indent it by mistake, it will repeat for every pizza: that's a logic error.",
        "print(\"I really love pizza!\")"
       ]
      },
      "c": "print(\"I really love pizza!\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "I really love pizza!"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-2",
    "t": "Animals",
    "orig": "Animals",
    "lvl": 1,
    "tr": "Think of at least three animals with a common characteristic. Store the names in a list, and use a <code>for</code> loop to print the name of each one.\n  <ul><li>Modify the program to print a sentence about each animal, like <code>A dog would make a great pet</code>.</li>\n  <li>Add a line at the end stating what they have in common: like <code>Any of these animals would make a great pet!</code></li></ul>",
    "steps": [
     {
      "f": "Create the list {{animals}} with three animals that have something in common.",
      "k": {
       "animals": [
        "Pick animals with a shared trait (e.g. pets).",
        "animals = [\"dog\", \"cat\", \"rabbit\"]"
       ]
      },
      "c": "animals = [\"dog\", \"cat\", \"rabbit\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Write the {{header}} of the for loop.",
      "k": {
       "header": [
        "A singular temporary name, a plural list, a colon.",
        "for animal in animals:"
       ]
      },
      "c": "for animal in animals:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "In the body, {{print}} a sentence for each animal.",
      "k": {
       "print": [
        "Indented 4 spaces, repeated for each animal.",
        "    print(f\"A {animal} would make a great pet.\")"
       ]
      },
      "c": "    print(f\"A {animal} would make a great pet.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "A dog would make a great pet.",
       "A cat would make a great pet.",
       "A rabbit would make a great pet."
      ]
     },
     {
      "f": "Outside the loop, print the {{common trait}}.",
      "k": {
       "common trait": [
        "An unindented line, run once after the loop.",
        "print(\"Any of these animals would make a great pet!\")"
       ]
      },
      "c": "print(\"Any of these animals would make a great pet!\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "Any of these animals would make a great pet!"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-3",
    "t": "Counting to Twenty",
    "orig": "Counting to Twenty",
    "lvl": 1,
    "tr": "Use a <code>for</code> loop to print the numbers from 1 to 20, inclusive.",
    "steps": [
     {
      "f": "Write a for loop that uses {{range}} to generate the numbers from 1 to 20.",
      "k": {
       "range": [
        "<code>range(a, b)</code> starts at <code>a</code> and stops BEFORE <code>b</code>: to include 20 you need range(1, 21). It's yet another case of \"off-by-one\" behavior.",
        "for value in range(1, 21):"
       ]
      },
      "c": "for value in range(1, 21):",
      "re": "^for\\s+\\w+\\s+in\\s*range\\(\\s*1\\s*,\\s*21\\s*\\)\\s*:$"
     },
     {
      "f": "In the loop body, {{print}} the value.",
      "k": {
       "print": [
        "An indented line: it shows every number generated by range.",
        "    print(value)"
       ]
      },
      "c": "    print(value)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "1",
       "2",
       "3",
       "…",
       "20"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-4",
    "t": "One Million",
    "orig": "One Million",
    "lvl": 2,
    "tr": "Make a list of the numbers from one to one million (use <code>range()</code> to generate it), and then use a <code>for</code> loop to print them. If the output takes too long, stop it by pressing CTRL-C or by closing the output window.",
    "steps": [
     {
      "f": "Create the list from 1 to one million with {{list(range(...))}}.",
      "k": {
       "list(range(...))": [
        "range() alone generates the numbers \"on the fly\": wrapping it in <code>list()</code> materializes them all at once. Underscores (1_000_001) make large numbers readable.",
        "numbers = list(range(1, 1_000_001))"
       ]
      },
      "c": "numbers = list(range(1, 1_000_001))",
      "re": "^\\w+\\s*=\\s*list\\(\\s*range\\(\\s*1\\s*,\\s*1[_\\s]*000[_\\s]*001\\s*\\)\\s*\\)$"
     },
     {
      "f": "Write the {{header}} of the loop over the list.",
      "k": {
       "header": [
        "for + a temporary name + in + the list name + a colon.",
        "for number in numbers:"
       ]
      },
      "c": "for number in numbers:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "In the body, {{print}} each number.",
      "k": {
       "print": [
        "A million prints! The terminal works for a while: be patient or hit CTRL-C.",
        "    print(number)"
       ]
      },
      "c": "    print(number)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "1",
       "2",
       "3",
       "…"
      ],
      "note": "A million lines won't fit in the tutor's console: the output is truncated after the first numbers. As the prompt says for the terminal (CTRL-C), here you can stop the run with ■ Stop."
     }
    ],
    "ch": 4
   },
   {
    "id": "4-5",
    "t": "Summing a Million",
    "orig": "Summing a Million",
    "lvl": 2,
    "tr": "Make a list of the numbers from one to one million, and then use <code>min()</code> and <code>max()</code> to make sure your list actually starts at one and ends at one million. Also use <code>sum()</code> to see how quickly Python can add up a million numbers.",
    "steps": [
     {
      "f": "Create the list {{numbers}} from 1 to one million.",
      "k": {
       "numbers": [
        "Same as Exercise 4-4.",
        "numbers = list(range(1, 1_000_001))"
       ]
      },
      "c": "numbers = list(range(1, 1_000_001))",
      "re": "^\\w+\\s*=\\s*list\\(\\s*range\\(\\s*1\\s*,\\s*1[_\\s]*000[_\\s]*001\\s*\\)\\s*\\)$"
     },
     {
      "f": "Print the {{minimum}} and the maximum of the list.",
      "k": {
       "minimum": [
        "<code>min()</code> and <code>max()</code> find the smallest and the largest value in the list, respectively.",
        "print(min(numbers))\nprint(max(numbers))"
       ]
      },
      "c": "print(min(numbers))\nprint(max(numbers))",
      "re": [
       "^print\\s*\\(\\s*min\\(\\s*\\w+\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*max\\(\\s*\\w+\\s*\\)\\s*\\)$"
      ],
      "so": [
       "1",
       "1000000"
      ]
     },
     {
      "f": "Print the {{sum}} of all the numbers.",
      "k": {
       "sum": [
        "<code>sum()</code> adds everything up in a flash: if the list starts at 1, the total is 500000500000.",
        "print(sum(numbers))"
       ]
      },
      "c": "print(sum(numbers))",
      "re": "^print\\s*\\(\\s*sum\\(\\s*\\w+\\s*\\)\\s*\\)$",
      "so": [
       "500000500000"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-6",
    "t": "Odd Numbers",
    "orig": "Odd Numbers",
    "lvl": 1,
    "tr": "Use the third argument of <code>range()</code> to make a list of the odd numbers from 1 to 20. Use a <code>for</code> loop to print each number.",
    "steps": [
     {
      "f": "Create the list of odd numbers using range's {{step}}.",
      "k": {
       "step": [
        "The third argument of range() is the \"step\": range(1, 21, 2) generates 1, 3, 5… skipping every other number.",
        "odd_numbers = list(range(1, 21, 2))"
       ]
      },
      "c": "odd_numbers = list(range(1, 21, 2))",
      "re": "^\\w+\\s*=\\s*list\\(\\s*range\\(\\s*1\\s*,\\s*21\\s*,\\s*2\\s*\\)\\s*\\)$"
     },
     {
      "f": "Write the {{header}} of the loop.",
      "k": {
       "header": [
        "for … in …:",
        "for number in odd_numbers:"
       ]
      },
      "c": "for number in odd_numbers:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "In the body, {{print}} each number.",
      "k": {
       "print": [
        "An indented print.",
        "    print(number)"
       ]
      },
      "c": "    print(number)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "1",
       "3",
       "5",
       "…",
       "19"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-7",
    "t": "Threes",
    "orig": "Threes",
    "lvl": 1,
    "tr": "Make a list of the multiples of 3, from 3 to 30. Use a <code>for</code> loop to print the numbers in your list.",
    "steps": [
     {
      "f": "Create the list of {{multiples}} of 3 using range's step.",
      "k": {
       "multiples": [
        "Start at 3 and go up to 30 with a step of 3: range(3, 31, 3).",
        "multiples = list(range(3, 31, 3))"
       ]
      },
      "c": "multiples = list(range(3, 31, 3))",
      "re": "^\\w+\\s*=\\s*list\\(\\s*range\\(\\s*3\\s*,\\s*31\\s*,\\s*3\\s*\\)\\s*\\)$"
     },
     {
      "f": "Write the {{header}} of the loop.",
      "k": {
       "header": [
        "The usual pattern.",
        "for number in multiples:"
       ]
      },
      "c": "for number in multiples:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "In the body, {{print}} each multiple.",
      "k": {
       "print": [
        "An indented print: 3, 6, 9… 30.",
        "    print(number)"
       ]
      },
      "c": "    print(number)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "3",
       "6",
       "9",
       "…",
       "30"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-8",
    "t": "Cubes",
    "orig": "Cubes",
    "lvl": 2,
    "tr": "A number raised to the third power is called a <b>cube</b>: the cube of 2 is written <code>2**3</code> in Python. Make a list of the first 10 cubes (that is, the cube of each integer from 1 through 10), and use a <code>for</code> loop to print the value of each one.",
    "steps": [
     {
      "f": "Start with an {{empty}} list that will hold the cubes.",
      "k": {
       "empty": [
        "Create it with just square brackets: we'll fill it in inside the loop, one cube at a time.",
        "cubes = []"
       ]
      },
      "c": "cubes = []",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\]$"
     },
     {
      "f": "Write the {{header}} of the loop from 1 to 10.",
      "k": {
       "header": [
        "range(1, 11) generates from 1 up to 10.",
        "for value in range(1, 11):"
       ]
      },
      "c": "for value in range(1, 11):",
      "re": "^for\\s+\\w+\\s+in\\s*range\\(\\s*1\\s*,\\s*11\\s*\\)\\s*:$"
     },
     {
      "f": "In the body, compute the cube and {{add it}} to the list.",
      "k": {
       "add it": [
        "The <code>**</code> operator is exponentiation: value**3 is the cube. Use append() to add it to the end of the list.",
        "    cubes.append(value ** 3)"
       ]
      },
      "c": "    cubes.append(value ** 3)",
      "re": "^\\w+\\.append\\(\\s*\\w+\\s*\\*\\*\\s*3\\s*\\)$"
     },
     {
      "f": "After the loop, print the {{complete list}}.",
      "k": {
       "complete list": [
        "An unindented line: the list now holds all ten cubes.",
        "print(cubes)"
       ]
      },
      "c": "print(cubes)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "[1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-9",
    "t": "Cube Comprehension",
    "orig": "Cube Comprehension",
    "lvl": 2,
    "tr": "Use a <b>list comprehension</b> to generate the list of the first 10 cubes in a single line.",
    "steps": [
     {
      "f": "Write the {{list comprehension}} in a single line.",
      "k": {
       "list comprehension": [
        "Inside the square brackets write the value expression FIRST (value ** 3) and THEN the for loop that feeds it. Note: no colon at the end.",
        "cubes = [value ** 3 for value in range(1, 11)]"
       ]
      },
      "c": "cubes = [value ** 3 for value in range(1, 11)]",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\w+\\s*\\*\\*\\s*3\\s+for\\s+\\w+\\s+in\\s+range\\(\\s*1\\s*,\\s*11\\s*\\)\\s*\\]$"
     },
     {
      "f": "Print the list of {{cubes}}.",
      "k": {
       "cubes": [
        "The same print as Exercise 4-8: identical output, much more compact code.",
        "print(cubes)"
       ]
      },
      "c": "print(cubes)",
      "re": "^print\\s*\\(\\s*\\w+\\s*\\)$",
      "so": [
       "[1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-10",
    "t": "Slices",
    "orig": "Slices",
    "lvl": 1,
    "tr": "Using one of the programs you wrote in this chapter, add several lines to the end of the program that:\n  <ul><li>print the message <code>The first three items in the list are:</code> and then, with a slice, the first three items;</li>\n  <li>print <code>Three items from the middle of the list are:</code> and then a slice with three middle items;</li>\n  <li>print <code>The last three items in the list are:</code> and then a slice with the last three.</li></ul>",
    "steps": [
     {
      "f": "Create a test list, for example a team's {{players}}.",
      "k": {
       "players": [
        "Five names: perfect for seeing slices at the start, in the middle, and at the end.",
        "players = [\"charles\", \"martina\", \"michael\", \"florence\", \"eli\"]"
       ]
      },
      "c": "players = [\"charles\", \"martina\", \"michael\", \"florence\", \"eli\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Print the message and the {{first three}} items with a slice.",
      "k": {
       "first three": [
        "A slice is written with a colon: <code>list[0:3]</code> takes items 0, 1 and 2 (the second index is EXCLUDED).",
        "print(\"The first three items in the list are:\")\nprint(players[0:3])"
       ]
      },
      "c": "print(\"The first three items in the list are:\")\nprint(players[0:3])",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\[\\s*0\\s*:\\s*3\\s*\\]\\s*\\)$"
      ],
      "so": [
       "The first three items in the list are:",
       "['charles', 'martina', 'michael']"
      ]
     },
     {
      "f": "Print the message and three items {{from the middle}}.",
      "k": {
       "from the middle": [
        "With five items, the middle is the slice [1:4]: it takes items 1, 2 and 3.",
        "print(\"Three items from the middle of the list are:\")\nprint(players[1:4])"
       ]
      },
      "c": "print(\"Three items from the middle of the list are:\")\nprint(players[1:4])",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\[\\s*1\\s*:\\s*4\\s*\\]\\s*\\)$"
      ],
      "so": [
       "Three items from the middle of the list are:",
       "['martina', 'michael', 'florence']"
      ]
     },
     {
      "f": "Print the message and the {{last three}} items.",
      "k": {
       "last three": [
        "With negative indexes you don't need to know the length: <code>[-3:]</code> means \"from the last three to the end\".",
        "print(\"The last three items in the list are:\")\nprint(players[-3:])"
       ]
      },
      "c": "print(\"The last three items in the list are:\")\nprint(players[-3:])",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\[\\s*-3\\s*:\\s*\\]\\s*\\)$"
      ],
      "so": [
       "The last three items in the list are:",
       "['michael', 'florence', 'eli']"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-11",
    "t": "My Pizzas, Your Pizzas",
    "orig": "My Pizzas, Your Pizzas",
    "lvl": 2,
    "tr": "Start with your program from Exercise 4-1. Make a copy of the list of pizzas, and call it <code>friend_pizzas</code>. Then:\n  <ul><li>Add a new pizza to the original list.</li>\n  <li>Add a different pizza to the list <code>friend_pizzas</code>.</li>\n  <li>Prove that you have two separate lists: print <code>My favorite pizzas are:</code> and loop through the first list; then print <code>My friend's favorite pizzas are:</code> and go through the second.</li>\n  <li>Make sure each new pizza ended up in the right list.</li></ul>",
    "steps": [
     {
      "f": "Create the list {{pizzas}} and make a {{copy}} of it with a full slice.",
      "k": {
       "pizzas": [
        "Start from your 4-1 list.",
        "pizzas = [\"margherita\", \"pepperoni\", \"hawaiian\"]"
       ],
       "copy": [
        "Watch out for the pitfall: <code>friend_pizzas = pizzas</code> does NOT copy the list: both names point to the same one! You need a full slice <code>[:]</code> to make a true copy.",
        "friend_pizzas = pizzas[:]"
       ]
      },
      "c": "pizzas = [\"margherita\", \"pepperoni\", \"hawaiian\"]\nfriend_pizzas = pizzas[:]",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\w+\\[\\s*:\\s*\\]$"
      ]
     },
     {
      "f": "Add a {{different}} pizza to each list.",
      "k": {
       "different": [
        "Two appends: one for each list. If the lists were actually the same one, you'd see both additions in both.",
        "pizzas.append(\"supreme\")\nfriend_pizzas.append(\"four cheese\")"
       ]
      },
      "c": "pizzas.append(\"supreme\")\nfriend_pizzas.append(\"four cheese\")",
      "re": [
       "^\\w+\\.append\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.append\\(\\s*[\"'].+[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Print the heading and go through your pizzas with a {{loop}}.",
      "k": {
       "loop": [
        "Three lines: a title print, the for, and an indented print with the pizza.",
        "print(\"My favorite pizzas are:\")\nfor pizza in pizzas:\n    print(pizza)"
       ]
      },
      "c": "print(\"My favorite pizzas are:\")\nfor pizza in pizzas:\n    print(pizza)",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "My favorite pizzas are:",
       "margherita",
       "pepperoni",
       "hawaiian",
       "supreme"
      ]
     },
     {
      "f": "Print the heading and go through the pizzas {{of your friend}} with a loop.",
      "k": {
       "of your friend": [
        "Same pattern on the second list: the four cheese shows up only here.",
        "print(\"My friend's favorite pizzas are:\")\nfor pizza in friend_pizzas:\n    print(pizza)"
       ]
      },
      "c": "print(\"My friend's favorite pizzas are:\")\nfor pizza in friend_pizzas:\n    print(pizza)",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "My friend's favorite pizzas are:",
       "margherita",
       "pepperoni",
       "hawaiian",
       "four cheese"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-12",
    "t": "More Loops",
    "orig": "More Loops",
    "lvl": 1,
    "tr": "The versions of <code>my_foods.py</code> shown in the section avoided for loops to save space. Choose one version of the program and write two <code>for</code> loops to print the two lists of foods.",
    "steps": [
     {
      "f": "Create the lists {{my_foods}} and {{friend_foods}}.",
      "k": {
       "my_foods": [
        "The book's program: two lists of foods, the second a copy of the first.",
        "my_foods = [\"pizza\", \"falafel\", \"carrot cake\"]"
       ],
       "friend_foods": [
        "A copy made with the full slice.",
        "friend_foods = my_foods[:]"
       ]
      },
      "c": "my_foods = [\"pizza\", \"falafel\", \"carrot cake\"]\nfriend_foods = my_foods[:]",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\w+\\[\\s*:\\s*\\]$"
      ]
     },
     {
      "f": "Print the title and a {{loop}} for your foods.",
      "k": {
       "loop": [
        "A print + the for + an indented print.",
        "print(\"My favorite foods are:\")\nfor food in my_foods:\n    print(food)"
       ]
      },
      "c": "print(\"My favorite foods are:\")\nfor food in my_foods:\n    print(food)",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "My favorite foods are:",
       "pizza",
       "falafel",
       "carrot cake"
      ]
     },
     {
      "f": "Print the title and a loop for the foods {{of your friend}}.",
      "k": {
       "of your friend": [
        "Ditto for the second list.",
        "print(\"My friend's favorite foods are:\")\nfor food in friend_foods:\n    print(food)"
       ]
      },
      "c": "print(\"My friend's favorite foods are:\")\nfor food in friend_foods:\n    print(food)",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "My friend's favorite foods are:",
       "pizza",
       "falafel",
       "carrot cake"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-13",
    "t": "Buffet",
    "orig": "Buffet",
    "lvl": 2,
    "tr": "A buffet-style restaurant offers only five basic foods. Think of five simple foods, and store them in a <b>tuple</b>.\n  <ul><li>Use a <code>for</code> loop to print each food the restaurant offers.</li>\n  <li>Try to modify one of the items, and make sure that Python rejects the change.</li>\n  <li>The restaurant changes its menu, replacing two of the dishes with others: rewrite the entire tuple, and use a <code>for</code> loop to print the new menu.</li></ul>",
    "steps": [
     {
      "f": "Create a {{tuple}} with five foods.",
      "k": {
       "tuple": [
        "Tuples are defined with parentheses and, like lists, contain items separated by commas. The difference: once created, they can't be changed.",
        "menu = (\"rice\", \"pasta\", \"chicken\", \"salad\", \"cake\")"
       ]
      },
      "c": "menu = (\"rice\", \"pasta\", \"chicken\", \"salad\", \"cake\")",
      "re": "^\\w+\\s*=\\s*\\(\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*){4}\\)$"
     },
     {
      "f": "Write the {{loop}} that prints each dish.",
      "k": {
       "loop": [
        "A for works on tuples exactly as it does on lists.",
        "for dish in menu:\n    print(dish)"
       ]
      },
      "c": "for dish in menu:\n    print(dish)",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "rice",
       "pasta",
       "chicken",
       "salad",
       "cake"
      ]
     },
     {
      "f": "Try to {{modify}} an item: Python must refuse.",
      "k": {
       "modify": [
        "Assigning to an element of a tuple raises a TypeError: concrete proof of immutability. Open the <b>Sandbox</b> panel, paste <code>menu = (\"rice\", \"pasta\", \"chicken\", \"salad\", \"cake\")</code> and <code>menu[0] = \"soup\"</code>, press Run, and watch the TypeError.",
        "menu[0] = \"soup\"  # TypeError!"
       ]
      },
      "c": null,
      "btn": "✓ Error observed in the Sandbox",
      "note": "The line that causes the error does NOT go into the exercise's program: tuples get rewritten as a whole, as in the next step."
     },
     {
      "f": "The menu changes: {{rewrite}} the entire tuple with two new dishes.",
      "k": {
       "rewrite": [
        "You can't change individual items, but you CAN reassign the variable to a brand-new tuple: that's always a legal assignment.",
        "menu = (\"rice\", \"soup\", \"chicken\", \"salad\", \"ice cream\")"
       ]
      },
      "c": "menu = (\"rice\", \"soup\", \"chicken\", \"salad\", \"ice cream\")",
      "re": "^\\w+\\s*=\\s*\\(\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*){4}\\)$"
     },
     {
      "f": "Print the {{new menu}} again with a loop.",
      "k": {
       "new menu": [
        "The same for as before: now with the updated dishes.",
        "for dish in menu:\n    print(dish)"
       ]
      },
      "c": "for dish in menu:\n    print(dish)",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "rice",
       "soup",
       "chicken",
       "salad",
       "ice cream"
      ]
     }
    ],
    "ch": 4
   },
   {
    "id": "4-14",
    "t": "PEP 8",
    "orig": "PEP 8",
    "lvl": 1,
    "tr": "Look through the original PEP 8 style guide on python.org. You won't use all of it right away, but it may be interesting to take a look.",
    "steps": [
     {
      "f": "Open the {{PEP 8 guide}} and skim it for a few minutes.",
      "k": {
       "PEP 8 guide": [
        "PEP 8 is the official style convention: indentation, line length, spacing around operators…",
        "https://python.org/dev/peps/pep-0008"
       ]
      },
      "c": null,
      "btn": "✓ Guide browsed",
      "note": "Three golden rules to remember: 4 spaces per indentation level, fewer than 80 characters per line, and one space around comparison operators."
     }
    ],
    "ch": 4
   },
   {
    "id": "4-15",
    "t": "Code Review",
    "orig": "Code Review",
    "lvl": 2,
    "tr": "Choose three of the programs you've written in this chapter and modify each one to comply with PEP 8:\n  <ul><li>Use four spaces for each indentation level.</li>\n  <li>Use lines less than 80 characters long (set your editor to show a vertical guide at the 80th character).</li>\n  <li>Don't use blank lines excessively in your files.</li></ul>",
    "steps": [
     {
      "f": "Apply four-space {{indentation}} in one of your programs.",
      "k": {
       "indentation": [
        "Configure VS Code to insert 4 spaces with TAB: never mix tabs and spaces.",
        "for x in xs:\n    print(x)  # exactly 4 spaces"
       ]
      },
      "c": null,
      "btn": "✓ Rule applied"
     },
     {
      "f": "Check the {{length}} of the lines (< 80 characters).",
      "k": {
       "length": [
        "Short lines are easier to read and sit nicely next to other files on screen.",
        "print(\"a line that is not too long\")"
       ]
      },
      "c": null,
      "btn": "✓ Rule applied"
     },
     {
      "f": "Cut down on excess {{blank lines}}.",
      "k": {
       "blank lines": [
        "One blank line between two logical sections is enough: three or four is too many.",
        "# section 1\n…\n\n# section 2\n…"
       ]
      },
      "c": null,
      "btn": "✓ Rule applied"
     }
    ],
    "ch": 4
   }
  ]
 },
 {
  "n": 5,
  "t": "If Statements",
  "sub": "Conditional tests and program branching",
  "concepts": [
   "Conditional tests: ==, !=, <, >, <=, >=, and, or, in, not in",
   "The if, if-else, and if-elif-else structures",
   "Series of independent if statements when multiple conditions can be true",
   "if statements nested in loops, and empty lists",
   "Style: one space around comparison operators"
  ],
  "ex": [
   {
    "id": "5-1",
    "t": "Conditional Tests",
    "orig": "Conditional Tests",
    "lvl": 2,
    "tr": "Write a series of conditional tests. Print a statement describing each test and your prediction for the result. Your code should look something like this:\n  <br><code>car = 'subaru'</code><br><code>print(\"Is car == 'subaru'? I predict True.\")</code><br><code>print(car == 'subaru')</code>\n  <ul><li>Look closely at the results and make sure you understand why each line evaluates to True or False.</li>\n  <li>Create at least 10 tests like these: at least 5 that evaluate to True and 5 that evaluate to False.</li></ul>",
    "steps": [
     {
      "f": "Create a variable {{car}} with a test value.",
      "k": {
       "car": [
        "You need a variable to compare several times.",
        "car = \"subaru\""
       ]
      },
      "c": "car = \"subaru\"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "Print the {{prediction}} and then the result of a TRUE test.",
      "k": {
       "prediction": [
        "Two print calls: the first describes the test, the second runs the comparison and shows True/False.",
        "print(\"Is car == 'subaru'? I predict True.\")\nprint(car == \"subaru\")"
       ]
      },
      "c": "print(\"Is car == 'subaru'? I predict True.\")\nprint(car == \"subaru\")",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\s*==\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "so": [
       "Is car == 'subaru'? I predict True.",
       "True"
      ]
     },
     {
      "f": "Print the prediction and the result of a {{False}} test.",
      "k": {
       "False": [
        "Same structure, but the comparison will fail: it shows False.",
        "print(\"Is car == 'audi'? I predict False.\")\nprint(car == \"audi\")"
       ]
      },
      "c": "print(\"Is car == 'audi'? I predict False.\")\nprint(car == \"audi\")",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\s*==\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "so": [
       "Is car == 'audi'? I predict False.",
       "False"
      ]
     },
     {
      "f": "In your editor, complete {{eight more tests}} (5 True and 5 False in total): write two of the tests you used here.",
      "k": {
       "eight more tests": [
        "Ideas: numeric comparisons (age >= 18), inequalities (!=), items in lists (\"mushrooms\" in toppings).",
        "print(age >= 18)"
       ]
      },
      "c": null,
      "ta": "Paste two of the additional tests (min 20 characters)…",
      "min": 20
     }
    ],
    "ch": 5
   },
   {
    "id": "5-2",
    "t": "More Conditional Tests",
    "orig": "More Conditional Tests",
    "lvl": 2,
    "tr": "Don't stop at 10 tests: write more comparisons and add them to the file. Make sure you have at least one True result and one False result for each of these categories:\n  <ul><li>tests for equality and inequality with strings;</li>\n  <li>tests using the <code>lower()</code> method;</li>\n  <li>numeric tests involving equality and inequality, greater than and less than, greater than or equal to, and less than or equal to;</li>\n  <li>tests using the <code>and</code> and <code>or</code> keywords;</li>\n  <li>tests to check whether an item is in a list, and whether it's not in a list.</li></ul>",
    "steps": [
     {
      "f": "Write two tests with {{strings}}: one True, one False.",
      "k": {
       "strings": [
        "String comparison is case-sensitive: \"Python\" != \"python\" is True.",
        "print(\"python\" == \"python\")\nprint(\"Python\" != \"python\")"
       ]
      },
      "c": "print(\"python\" == \"python\")\nprint(\"Python\" != \"python\")",
      "re": [
       "^print\\s*\\(\\s*[\"'].+[\"']\\s*==\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*[\"'].+[\"']\\s*!=\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "so": [
       "True",
       "True"
      ]
     },
     {
      "f": "Write a test using {{lower()}} that ignores case.",
      "k": {
       "lower()": [
        "Convert the value to lowercase first, then compare: the test becomes case-insensitive.",
        "print(\"Tesla\".lower() == \"tesla\")"
       ]
      },
      "c": "print(\"Tesla\".lower() == \"tesla\")",
      "re": "^print\\s*\\(\\s*[\"'].+[\"']\\.lower\\(\\)\\s*==\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "True"
      ]
     },
     {
      "f": "Write {{numeric}} tests for equality and inequality (including greater/less than).",
      "k": {
       "numeric": [
        "One test for each pair: e.g. equality, inequality, >, <, >=, <=.",
        "print(18 >= 18)\nprint(17 > 18)"
       ]
      },
      "c": "print(18 >= 18)\nprint(17 > 18)",
      "re": [
       "^print\\s*\\(\\s*\\d+\\s*[<>]=?\\s*\\d+\\s*\\)$",
       "^print\\s*\\(\\s*\\d+\\s*[<>]=?\\s*\\d+\\s*\\)$"
      ],
      "so": [
       "True",
       "False"
      ]
     },
     {
      "f": "Write one test with {{and}} and one with {{or}}.",
      "k": {
       "and": [
        "<code>and</code> is True only if BOTH tests pass.",
        "print(22 >= 21 and 18 >= 21)"
       ],
       "or": [
        "<code>or</code> is True if AT LEAST one of the tests passes.",
        "print(22 >= 21 or 18 >= 21)"
       ]
      },
      "c": "print(22 >= 21 and 18 >= 21)\nprint(22 >= 21 or 18 >= 21)",
      "re": [
       "^print\\s*\\(\\s*\\d+\\s*>=\\s*\\d+\\s*and\\s*\\d+\\s*>=\\s*\\d+\\s*\\)$",
       "^print\\s*\\(\\s*\\d+\\s*>=\\s*\\d+\\s*or\\s*\\d+\\s*>=\\s*\\d+\\s*\\)$"
      ],
      "so": [
       "False",
       "True"
      ]
     },
     {
      "f": "Write one test with {{in}} and one with {{not in}} on a list.",
      "k": {
       "in": [
        "<code>in</code> asks \"is this value in the list?\".",
        "print(\"mushrooms\" in [\"mushrooms\", \"olives\"])"
       ],
       "not in": [
        "<code>not in</code> is the opposite.",
        "print(\"pineapple\" not in [\"mushrooms\", \"olives\"])"
       ]
      },
      "c": "print(\"mushrooms\" in [\"mushrooms\", \"olives\"])\nprint(\"pineapple\" not in [\"mushrooms\", \"olives\"])",
      "re": [
       "^print\\s*\\(\\s*[\"'].+[\"']\\s*in\\s*\\[.+\\]\\s*\\)$",
       "^print\\s*\\(\\s*[\"'].+[\"']\\s*not\\s+in\\s*\\[.+\\]\\s*\\)$"
      ],
      "so": [
       "True",
       "True"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-3",
    "t": "Alien Colors #1",
    "orig": "Alien Colors #1",
    "lvl": 1,
    "tr": "Imagine an alien has just been shot down in a video game. Create a variable called <code>alien_color</code> and assign it a value of 'green', 'yellow', or 'red'.\n  <ul><li>Write an <code>if</code> statement to test whether the alien's color is green. If it is, print a message stating that the player just earned 5 points.</li>\n  <li>Write one version of the program that passes the test and another that fails it. The version that fails produces no output.</li></ul>",
    "steps": [
     {
      "f": "Create the {{alien_color}} variable with a color.",
      "k": {
       "alien_color": [
        "The exact name required by the book, with an underscore. The value goes in quotes.",
        "alien_color = \"green\""
       ]
      },
      "c": "alien_color = \"green\"",
      "re": "^alien_color\\s*=\\s*[\"'](green|yellow|red)[\"']\\s*$"
     },
     {
      "f": "Write the {{if}} test that checks whether the color is green.",
      "k": {
       "if": [
        "An if line contains: the <code>if</code> keyword, the test with the == operator, and a colon. Note: comparing takes TWO equal signs (==); a single one assigns!",
        "if alien_color == \"green\":"
       ]
      },
      "c": "if alien_color == \"green\":",
      "re": "^if\\s+alien_color\\s*==\\s*[\"']green[\"']\\s*:$"
     },
     {
      "f": "In the body of the if, {{print}} the 5 points earned.",
      "k": {
       "print": [
        "A line indented by 4 spaces: it runs ONLY if the test is True.",
        "    print(\"You just earned 5 points!\")"
       ]
      },
      "c": "    print(\"You just earned 5 points!\")",
      "re": "^print\\s*\\(.+\\)$",
      "so": [
       "You just earned 5 points!"
      ]
     },
     {
      "f": "In the editor, change alien_color to {{'yellow'}} and run it again: the test fails and the program prints nothing.",
      "k": {
       "'yellow'": [
        "With a different color the if test is False: the body is skipped and there is no output. That's the correct behavior!",
        "alien_color = \"yellow\"  # no output"
       ]
      },
      "c": null,
      "btn": "✓ Behavior verified"
     }
    ],
    "ch": 5
   },
   {
    "id": "5-4",
    "t": "Alien Colors #2",
    "orig": "Alien Colors #2",
    "lvl": 1,
    "tr": "Choose a color for the alien as in Exercise 5-3, and write an <code>if-else</code> chain.\n  <ul><li>If the alien's color is green, print a message that the player just earned 5 points for shooting it down.</li>\n  <li>If the color isn't green, print a message that the player just earned 10 points.</li>\n  <li>Write one version of the program that runs the if block and another that runs the else block.</li></ul>",
    "steps": [
     {
      "f": "Create the {{alien_color}} variable with a color.",
      "k": {
       "alien_color": [
        "Start again from 5-3.",
        "alien_color = \"green\""
       ]
      },
      "c": "alien_color = \"green\"",
      "re": "^alien_color\\s*=\\s*[\"'](green|yellow|red)[\"']\\s*$"
     },
     {
      "f": "Write the {{if}} test for green and print the 5 points.",
      "k": {
       "if": [
        "Test + indented body, as in 5-3.",
        "if alien_color == \"green\":\n    print(\"You just earned 5 points!\")"
       ]
      },
      "c": "if alien_color == \"green\":\n    print(\"You just earned 5 points!\")",
      "re": [
       "^if\\s+alien_color\\s*==\\s*[\"']green[\"']\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     },
     {
      "f": "Add the {{else}} branch with the 10 points.",
      "k": {
       "else": [
        "<code>else:</code> goes at the SAME indentation as if, with no condition: its body runs when all previous tests fail.",
        "else:\n    print(\"You just earned 10 points!\")"
       ]
      },
      "c": "else:\n    print(\"You just earned 10 points!\")",
      "re": [
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "so": [
       "You just earned 5 points!"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-5",
    "t": "Alien Colors #3",
    "orig": "Alien Colors #3",
    "lvl": 2,
    "tr": "Turn the if-else chain from Exercise 5-4 into an <code>if-elif-else</code> chain.\n  <ul><li>If the alien is green, print a message that the player earned 5 points.</li>\n  <li>If the alien is yellow, print a message that the player earned 10 points.</li>\n  <li>If the alien is red, print a message that the player earned 15 points.</li>\n  <li>Write three versions of the program, making sure each message is printed for the appropriate color.</li></ul>",
    "steps": [
     {
      "f": "Create the {{alien_color}} variable.",
      "k": {
       "alien_color": [
        "Start with \"green\".",
        "alien_color = \"green\""
       ]
      },
      "c": "alien_color = \"green\"",
      "re": "^alien_color\\s*=\\s*[\"'](green|yellow|red)[\"']\\s*$"
     },
     {
      "f": "Write the {{if}} test for green (5 points).",
      "k": {
       "if": [
        "The first branch of the chain.",
        "if alien_color == \"green\":\n    print(\"You just earned 5 points!\")"
       ]
      },
      "c": "if alien_color == \"green\":\n    print(\"You just earned 5 points!\")",
      "re": [
       "^if\\s+alien_color\\s*==\\s*[\"']green[\"']\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     },
     {
      "f": "Add the {{elif}} branch for yellow (10 points).",
      "k": {
       "elif": [
        "<code>elif</code> (else-if) evaluates a new test ONLY if the previous ones failed. Same indentation as if.",
        "elif alien_color == \"yellow\":\n    print(\"You just earned 10 points!\")"
       ]
      },
      "c": "elif alien_color == \"yellow\":\n    print(\"You just earned 10 points!\")",
      "re": [
       "^elif\\s+alien_color\\s*==\\s*[\"']yellow[\"']\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     },
     {
      "f": "Finish with the {{else}} branch for red (15 points).",
      "k": {
       "else": [
        "else catches all remaining cases (here: red). Python runs ONLY ONE branch of the chain.",
        "else:\n    print(\"You just earned 15 points!\")"
       ]
      },
      "c": "else:\n    print(\"You just earned 15 points!\")",
      "re": [
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "so": [
       "You just earned 5 points!"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-6",
    "t": "Stages of Life",
    "orig": "Stages of Life",
    "lvl": 2,
    "tr": "Write an <code>if-elif-else</code> chain that determines a person's stage of life. Set a value for the variable <code>age</code> and then:\n  <ul><li>if the person is less than 2 years old, print that the person is a baby;</li>\n  <li>if the person is at least 2 years old but less than 4, print that the person is a toddler;</li>\n  <li>if the person is at least 4 years old but less than 13, print that the person is a kid;</li>\n  <li>if the person is at least 13 years old but less than 20, print that the person is a teenager;</li>\n  <li>if the person is at least 20 years old but less than 65, print that the person is an adult;</li>\n  <li>if the person is 65 years old or older, print that the person is an elder.</li></ul>",
    "steps": [
     {
      "f": "Set the {{age}} variable to a test value.",
      "k": {
       "age": [
        "The book uses age as the variable name.",
        "age = 25"
       ]
      },
      "c": "age = 25",
      "re": "^age\\s*=\\s*\\d+\\s*$"
     },
     {
      "f": "Write the {{complete chain}} if-elif-else with all six stages.",
      "k": {
       "complete chain": [
        "Order the tests from most restrictive to broadest: after the \"less than 2\" test, an elif can simply check \"less than 4\", because we already know the age is at least 2. Each branch: test + colon + indented body.",
        "if age < 2:\n    print(\"baby\")\nelif age < 4:\n    …"
       ]
      },
      "c": "if age < 2:\n    print(\"You are a baby.\")\nelif age < 4:\n    print(\"You are a toddler.\")\nelif age < 13:\n    print(\"You are a kid.\")\nelif age < 20:\n    print(\"You are a teenager.\")\nelif age < 65:\n    print(\"You are an adult.\")\nelse:\n    print(\"You are an elder.\")",
      "re": [
       "^if\\s+age\\s*<\\s*2\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^elif\\s+age\\s*<\\s*4\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^elif\\s+age\\s*<\\s*13\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^elif\\s+age\\s*<\\s*20\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^elif\\s+age\\s*<\\s*65\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "so": [
       "You are an adult."
      ]
     },
     {
      "f": "In the editor, try the chain with other {{age}} values such as 1, 3, 10, 17, 70: change a single line and run it again.",
      "k": {
       "age": [
        "The chain covers every case: each value lands in the right branch.",
        "age = 3"
       ]
      },
      "c": null,
      "btn": "✓ Test run"
     }
    ],
    "ch": 5
   },
   {
    "id": "5-7",
    "t": "Favorite Fruit",
    "orig": "Favorite Fruit",
    "lvl": 1,
    "tr": "Make a list of your favorite fruits, and write a series of independent <code>if</code> statements.\n  <ul><li>Make the <code>favorite_fruits</code> list with three fruits.</li>\n  <li>Write five if statements: each one checks whether a certain fruit is in your list. If the fruit is in your list, the if block should print a message such as <code>You really like bananas!</code></li></ul>",
    "steps": [
     {
      "f": "Create the {{fruits}} list with three fruits.",
      "k": {
       "fruits": [
        "Three items are enough: the tests will query them.",
        "fruits = [\"apples\", \"bananas\", \"cherries\"]"
       ]
      },
      "c": "fruits = [\"apples\", \"bananas\", \"cherries\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Write five {{independent}} if statements (not elif!) using the in test.",
      "k": {
       "independent": [
        "When multiple conditions can be true at the same time, you need SEPARATE if statements: an elif chain would stop at the first passing test, skipping the rest.",
        "if \"apples\" in fruits:\n    print(\"You really like apples!\")\nif \"bananas\" in fruits:\n    …"
       ]
      },
      "c": "if \"apples\" in fruits:\n    print(\"You really like apples!\")\nif \"bananas\" in fruits:\n    print(\"You really like bananas!\")\nif \"kiwi\" in fruits:\n    print(\"You really like kiwis!\")\nif \"cherries\" in fruits:\n    print(\"You really like cherries!\")\nif \"pears\" in fruits:\n    print(\"You really like pears!\")",
      "re": [
       "^if\\s+[\"'].+[\"']\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^if\\s+[\"'].+[\"']\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^if\\s+[\"'].+[\"']\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^if\\s+[\"'].+[\"']\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^if\\s+[\"'].+[\"']\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "so": [
       "You really like apples!",
       "You really like bananas!",
       "You really like cherries!"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-8",
    "t": "Hello Admin",
    "orig": "Hello Admin",
    "lvl": 2,
    "tr": "Make a list of five or more usernames, including the name 'admin'. Imagine you're writing the code that prints a greeting after each user logs in. Loop through the list and print a greeting to each user.\n  <ul><li>If the username is 'admin', print a special greeting, such as <code>Hello admin, would you like to see a status report?</code></li>\n  <li>Otherwise, print a generic greeting, such as <code>Hello Jaden, thank you for logging in again.</code></li></ul>",
    "steps": [
     {
      "f": "Create the {{users}} list with 'admin' included.",
      "k": {
       "users": [
        "Five names, one of which is \"admin\".",
        "users = [\"admin\", \"jaden\", \"sara\", \"luca\", \"mia\"]"
       ]
      },
      "c": "users = [\"admin\", \"jaden\", \"sara\", \"luca\", \"mia\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
      "note": "Make sure 'admin' is included among the names."
     },
     {
      "f": "Write the {{loop}} that goes through the list.",
      "k": {
       "loop": [
        "The usual for: a singular temporary name + the list + a colon.",
        "for user in users:"
       ]
      },
      "c": "for user in users:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "Inside the loop, write the test for {{admin}} and the two bodies.",
      "k": {
       "admin": [
        "The if is indented by 4 spaces (inside the loop); the if and else bodies by 8. For the generic greeting you need an f-string with the name.",
        "    if user == \"admin\":\n        print(\"Hello admin, would you like to see a status report?\")\n    else:\n        print(f\"Hello {user}, thank you for logging in again.\")"
       ]
      },
      "c": "    if user == \"admin\":\n        print(\"Hello admin, would you like to see a status report?\")\n    else:\n        print(f\"Hello {user}, thank you for logging in again.\")",
      "re": [
       "^if\\s+\\w+\\s*==\\s*[\"']admin[\"']\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Hello admin, would you like to see a status report?",
       "Hello jaden, thank you for logging in again.",
       "Hello sara, thank you for logging in again.",
       "Hello luca, thank you for logging in again.",
       "Hello mia, thank you for logging in again."
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-9",
    "t": "No Users",
    "orig": "No Users",
    "lvl": 1,
    "tr": "Add an <code>if</code> test to hello_admin.py to make sure the list of users is not empty.\n  <ul><li>If the list is empty, print the message <code>We need to find some users!</code></li>\n  <li>Remove all of the names from the list, and make sure the correct message is printed.</li></ul>",
    "steps": [
     {
      "f": "Create the {{empty}} list.",
      "k": {
       "empty": [
        "A list with no items: square brackets with nothing inside. In an if test, an empty list counts as False!",
        "users = []"
       ]
      },
      "c": "users = []",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\]$"
     },
     {
      "f": "Write the test: if the list {{is not empty}}, print a greeting; otherwise print a warning.",
      "k": {
       "is not empty": [
        "Just write <code>if users:</code>: a non-empty list is \"truthy\", an empty one is \"falsy\". The else covers the empty case.",
        "if users:\n    for user in users:\n        print(f\"Hello {user}!\")\nelse:\n    print(\"We need to find some users!\")"
       ]
      },
      "c": "if users:\n    for user in users:\n        print(f\"Hello {user}!\")\nelse:\n    print(\"We need to find some users!\")",
      "re": [
       "^if\\s+\\w+\\s*:$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "so": [
       "We need to find some users!"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-10",
    "t": "Checking Usernames",
    "orig": "Checking Usernames",
    "lvl": 3,
    "tr": "Create a program that simulates the way websites make sure everyone has a unique username.\n  <ul><li>Make a list of five or more usernames called <code>current_users</code>.</li>\n  <li>Make a new list of five usernames called <code>new_users</code>, making sure one or two of the new names are also in current_users.</li>\n  <li>Loop through the new_users list and, for each one, check whether that name has already been used: if so, print that the person will need to enter a new name; otherwise print that the name is available.</li>\n  <li>Make sure the comparison is case-insensitive: if 'John' has been used, 'JOHN' should not be accepted. (Hint: make a copy of current_users containing the lowercase versions of the existing names.)</li></ul>",
    "steps": [
     {
      "f": "Create the {{current_users}} list with five names.",
      "k": {
       "current_users": [
        "The exact name required by the book.",
        "current_users = [\"john\", \"sara\", \"luca\", \"mia\", \"admin\"]"
       ]
      },
      "c": "current_users = [\"john\", \"sara\", \"luca\", \"mia\", \"admin\"]",
      "re": "^current_users\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Create the {{new_users}} list with new names and a few that are already used.",
      "k": {
       "new_users": [
        "Include a few variants with different capitalization to test the case-insensitive comparison.",
        "new_users = [\"JOHN\", \"elena\", \"Mia\", \"nora\", \"dario\"]"
       ]
      },
      "c": "new_users = [\"JOHN\", \"elena\", \"Mia\", \"nora\", \"dario\"]",
      "re": "^new_users\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Make a copy of current_users {{in lowercase}}.",
      "k": {
       "in lowercase": [
        "It lets you compare without distinguishing uppercase from lowercase. A list comprehension converts each name as it copies.",
        "current_min = [user.lower() for user in current_users]"
       ]
      },
      "c": "current_min = [user.lower() for user in current_users]",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\w+\\.lower\\(\\)\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$"
     },
     {
      "f": "Write the loop with the {{membership}} test (case-insensitive).",
      "k": {
       "membership": [
        "For each new name, convert it to lowercase and check it with <code>in</code> against the copy. Put the if/else inside the loop for the two messages.",
        "for new in new_users:\n    if new.lower() in current_min:\n        print(f\"{new}: name already in use, choose another one.\")\n    else:\n        print(f\"{new}: name available!\")"
       ]
      },
      "c": "for new in new_users:\n    if new.lower() in current_min:\n        print(f\"{new}: name already in use, choose another one.\")\n    else:\n        print(f\"{new}: name available!\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^if\\s+\\w+\\.lower\\(\\)\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+[\"']\\s*\\)$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+[\"']\\s*\\)$"
      ],
      "so": [
       "JOHN: name already in use, choose another one.",
       "elena: name available!",
       "Mia: name already in use, choose another one.",
       "nora: name available!",
       "dario: name available!"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-11",
    "t": "Ordinal Numbers",
    "orig": "Ordinal Numbers",
    "lvl": 2,
    "tr": "Ordinal numbers indicate their position in a series, such as 1st or 2nd. Most ordinal numbers end in th, except 1, 2, and 3.\n  <ul><li>Store the numbers from 1 to 9 in a list.</li>\n  <li>Loop through the list.</li>\n  <li>Inside the loop, use an if-elif-else chain to print the correct ordinal suffix for each number. The output should be <code>1st 2nd 3rd 4th 5th 6th 7th 8th 9th</code>, with each result on a separate line.</li></ul>",
    "steps": [
     {
      "f": "Create the list of numbers from 1 to 9 with {{list(range(...))}}.",
      "k": {
       "list(range(...))": [
        "Remember: range stops BEFORE the endpoint, so range(1, 10) generates 1…9.",
        "numbers = list(range(1, 10))"
       ]
      },
      "c": "numbers = list(range(1, 10))",
      "re": "^\\w+\\s*=\\s*list\\(\\s*range\\(\\s*1\\s*,\\s*10\\s*\\)\\s*\\)$"
     },
     {
      "f": "Write the {{loop}} over the numbers.",
      "k": {
       "loop": [
        "for number in numbers:",
        "for number in numbers:"
       ]
      },
      "c": "for number in numbers:",
      "re": "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$"
     },
     {
      "f": "Inside the loop, write the if-elif-else chain for the {{suffix}}.",
      "k": {
       "suffix": [
        "Three special cases (1→st, 2→nd, 3→rd) and one else for all the others (th). Use an f-string to join the number and the suffix.",
        "    if number == 1:\n        print(f\"{number}st\")\n    elif number == 2:\n        …"
       ]
      },
      "c": "    if number == 1:\n        print(f\"{number}st\")\n    elif number == 2:\n        print(f\"{number}nd\")\n    elif number == 3:\n        print(f\"{number}rd\")\n    else:\n        print(f\"{number}th\")",
      "re": [
       "^if\\s+\\w+\\s*==\\s*1\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^elif\\s+\\w+\\s*==\\s*2\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^elif\\s+\\w+\\s*==\\s*3\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "1st",
       "2nd",
       "3rd",
       "4th",
       "5th",
       "6th",
       "7th",
       "8th",
       "9th"
      ]
     }
    ],
    "ch": 5
   },
   {
    "id": "5-12",
    "t": "Styling if Statements",
    "orig": "Styling if Statements",
    "lvl": 1,
    "tr": "Go back through the programs you wrote in this chapter and make sure you styled your conditional tests appropriately: use one space around comparison operators (e.g. <code>if age < 4:</code> is better than <code>if age<4:</code>).",
    "steps": [
     {
      "f": "Check the {{spaces}} around the comparison operators in one of your if statements.",
      "k": {
       "spaces": [
        "Spacing doesn't change execution, but it makes your code readable: it's PEP 8.",
        "if age < 4:   # not: if age<4:"
       ]
      },
      "c": null,
      "btn": "✓ Style checked"
     }
    ],
    "ch": 5
   },
   {
    "id": "5-13",
    "t": "Your Ideas",
    "orig": "Your Ideas",
    "lvl": 1,
    "tr": "At this point you're a more capable programmer than you were when you started this book. Now that you have a better sense of how real-world situations are modeled in programs, you might think about some problems you could solve with your own programs. Note any new ideas that come to mind for problems to solve as your skills continue to grow. Think about games you'd like to write, data sets you'd like to explore, and web applications you'd like to create.",
    "steps": [
     {
      "f": "Note down a {{problem}} you'd like to solve with a program.",
      "k": {
       "problem": [
        "Think small: an everyday problem you can automate with if statements, lists, and loops.",
        "e.g. \"A homework tracker: for each subject, if my average grade is below 60, warn me\""
       ]
      },
      "c": null,
      "ta": "Describe the problem and how you'd solve it…",
      "min": 20
     },
     {
      "f": "Note down {{another idea}}: a game, a data set, or a web app.",
      "k": {
       "another idea": [
        "With if statements, lists, loops, and functions (ch. 8) you can already build a lot.",
        "e.g. \"A quiz game that keeps score\""
       ]
      },
      "c": null,
      "ta": "Second idea…",
      "min": 20
     }
    ],
    "ch": 5
   }
  ]
 },
 {
  "n": 6,
  "t": "Dictionaries",
  "sub": "Key-value pairs, looping through dictionaries, and nesting",
  "concepts": [
   "Dictionaries: collections of key-value pairs in curly braces",
   "Accessing, adding, and modifying items",
   "The get() method for missing keys",
   "Looping through keys, values, and pairs with .items(), .keys(), .values()",
   "sorted() and set() with dictionaries",
   "Nesting: lists of dictionaries, lists in dictionaries, dictionaries in dictionaries"
  ],
  "ex": [
   {
    "id": "6-1",
    "t": "Person",
    "orig": "Person",
    "lvl": 1,
    "tr": "Use a dictionary to store information about a person you know. Store their first name, last name, age, and the city in which they live. Use keys like <code>first_name</code>, <code>last_name</code>, <code>age</code>, and <code>city</code>. Print each piece of information stored.",
    "steps": [
     {
      "f": "Create a {{person}} dictionary with the four required keys.",
      "k": {
       "person": [
        "A dictionary is defined with curly braces: key: value pairs separated by commas. The keys are strings; the values can be of any type.",
        "person = {'first_name': 'ada', 'last_name': 'lovelace', 'age': 36, 'city': 'london'}"
       ]
      },
      "c": "person = {\"first_name\": \"ada\", \"last_name\": \"lovelace\", \"age\": 36, \"city\": \"london\"}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"']first_name[\"'].+[\"']last_name[\"'].+[\"']age[\"'].+[\"']city[\"'].*\\}$"
     },
     {
      "f": "Print the {{name}} by accessing it with its key.",
      "k": {
       "name": [
        "You access values with square bracket notation: <code>dictionary[\"key\"]</code>. Careful: <b>not</b> a dot, which is for attributes and methods.",
        "print(person['first_name'])"
       ]
      },
      "c": "print(person[\"first_name\"])",
      "re": "^print\\s*\\(\\s*\\w+\\[\\s*[\"']first_name[\"']\\s*\\]\\s*\\)$",
      "so": [
       "ada"
      ]
     },
     {
      "f": "Print the other three pieces of information the same way.",
      "k": {
       "information": [
        "Repeat the pattern for last_name, age, and city. You can use an f-string for more readable output.",
        "print(person['last_name'])\nprint(person['age'])\nprint(person['city'])"
       ]
      },
      "c": "print(person[\"last_name\"])\nprint(person[\"age\"])\nprint(person[\"city\"])",
      "re": [
       "^print\\s*\\(\\s*\\w+\\[\\s*[\"']last_name[\"']\\s*\\]\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\[\\s*[\"']age[\"']\\s*\\]\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\[\\s*[\"']city[\"']\\s*\\]\\s*\\)$"
      ],
      "so": [
       "lovelace",
       "36",
       "london"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-2",
    "t": "Favorite Numbers",
    "orig": "Favorite Numbers",
    "lvl": 1,
    "tr": "Use a dictionary to store people's favorite numbers. Think of five names and use them as keys in your dictionary. Think of a favorite number for each person and store it as a value. Print each person's name and their favorite number.",
    "steps": [
     {
      "f": "Create a {{favorite_numbers}} dictionary with five name: number pairs.",
      "k": {
       "favorite_numbers": [
        "The keys are strings (names) and the values are integers (numbers). Five pairs on a single line, or spread across multiple lines.",
        "favorite_numbers = {'marie': 7, 'alan': 42, 'ada': 3, 'grace': 11, 'linus': 21}"
       ]
      },
      "c": "favorite_numbers = {\"marie\": 7, \"alan\": 42, \"ada\": 3, \"grace\": 11, \"linus\": 21}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*\\d+.*\\}$"
     },
     {
      "f": "Write a {{loop}} that walks through the key-value pairs.",
      "k": {
       "loop": [
        "To walk through key-value pairs you need the <code>.items()</code> method: it returns a sequence of <code>(key, value)</code> tuples. The for loop unpacks them into two temporary variables.",
        "for name, number in favorite_numbers.items():"
       ]
      },
      "c": "for name, number in favorite_numbers.items():",
      "re": "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$"
     },
     {
      "f": "In the body, {{print}} the name and number with an f-string.",
      "k": {
       "print": [
        "Indent the line by 4 spaces. <code>.title()</code> makes the name look nicer.",
        "    print(f\"{name.title()}'s favorite number is {number}.\")"
       ]
      },
      "c": "    print(f\"{name.title()}'s favorite number is {number}.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*\\{[^}]*\\}.*[\"']\\s*\\)$",
      "so": [
       "Marie's favorite number is 7.",
       "Alan's favorite number is 42.",
       "Ada's favorite number is 3.",
       "Grace's favorite number is 11.",
       "Linus's favorite number is 21."
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-3",
    "t": "Glossary",
    "orig": "Glossary",
    "lvl": 2,
    "tr": "A Python dictionary can be used to model an actual dictionary. Think of five programming words you've learned in the previous chapters and use them as keys, with their meanings as values. Print each word and its meaning in a neatly formatted output. You can print the word followed by a colon and then its meaning, or print the word on one line and its meaning indented on a second line. Use the newline character (<code>\\n</code>) to insert a blank line between each word-meaning pair.",
    "steps": [
     {
      "f": "Create the {{glossary}} dictionary with five terms and meanings.",
      "k": {
       "glossary": [
        "The keys are the Python terms and the values are their definitions. It's long but readable when spread across multiple lines.",
        "glossary = {'list': 'an ordered and modifiable collection', 'tuple': 'an ordered and immutable collection', 'string': 'a sequence of characters', 'variable': 'a name associated with a value', 'function': 'a reusable block of code'}"
       ]
      },
      "c": "glossary = {\"list\": \"an ordered and modifiable collection\", \"tuple\": \"an ordered and immutable collection\", \"string\": \"a sequence of characters\", \"variable\": \"a name associated with a value\", \"function\": \"a reusable block of code\"}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*[\"'].+[\"'].*\\}$"
     },
     {
      "f": "Print the header and walk through the glossary with {{items()}}.",
      "k": {
       "items()": [
        "The standard loop over a dictionary uses .items(). For each pair, print the term, a colon, and the meaning, then a blank line.",
        "for term, meaning in glossary.items():\n    print(f\"{term}: {meaning}\\n\")"
       ]
      },
      "c": "for term, meaning in glossary.items():\n    print(f\"{term}: {meaning}\\n\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"\\'].*\\{[^}]*\\}.+\\{[^}]*\\}.*\\\\n.*[\"\\']\\s*\\)$"
      ],
      "so": [
       "list: an ordered and modifiable collection",
       "tuple: an ordered and immutable collection",
       "string: a sequence of characters",
       "variable: a name associated with a value",
       "function: a reusable block of code"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-4",
    "t": "Glossary 2",
    "orig": "Glossary 2",
    "lvl": 2,
    "tr": "Now that you know how to loop through a dictionary, clean up the code from Exercise 6-3 by replacing the series of <code>print()</code> calls with a loop that runs through the dictionary's keys and values. When you're sure your loop works, add five more Python terms to your glossary: the next time you run the program, they'll automatically appear in the output.",
    "steps": [
     {
      "f": "Start again from the {{glossary}} dictionary from 6-3.",
      "k": {
       "glossary": [
        "You can paste it here as it is, or write it out again.",
        "glossary = {'list': '…', 'tuple': '…', 'string': '…', 'variable': '…', 'function': '…'}"
       ]
      },
      "c": "glossary = {\"list\": \"an ordered and modifiable collection\", \"tuple\": \"an ordered and immutable collection\", \"string\": \"a sequence of characters\", \"variable\": \"a name associated with a value\", \"function\": \"a reusable block of code\"}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*[\"'].+[\"'].*\\}$"
     },
     {
      "f": "Add five new terms to the {{dictionary}}.",
      "k": {
       "dictionary": [
        "You can add them directly in the definition, or with later assignments like <code>glossary['loop'] = '…'</code>.",
        "glossary['loop'] = 'a structure that repeats a block of code'"
       ]
      },
      "c": "glossary[\"loop\"] = \"a structure that repeats a block of code\"\nglossary[\"module\"] = \"an importable .py file\"\nglossary[\"exception\"] = \"an error you can handle\"\nglossary[\"dictionary\"] = \"a key-value collection\"\nglossary[\"class\"] = \"a blueprint for creating objects\"",
      "re": [
       "^\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s*=\\s*[\"'].+[\"']\\s*$",
       "^\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s*=\\s*[\"'].+[\"']\\s*$",
       "^\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s*=\\s*[\"'].+[\"']\\s*$",
       "^\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s*=\\s*[\"'].+[\"']\\s*$",
       "^\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s*=\\s*[\"'].+[\"']\\s*$"
      ]
     },
     {
      "f": "Walk through the whole dictionary with a {{loop}} over .items() and print each pair.",
      "k": {
       "loop": [
        "The advantage of the loop: you don't have to update the code when you add terms. A single <code>for</code> covers everything.",
        "for term, meaning in glossary.items():\n    print(f\"{term}: {meaning}\\n\")"
       ]
      },
      "c": "for term, meaning in glossary.items():\n    print(f\"{term}: {meaning}\\n\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"\\'].*\\{[^}]*\\}.+\\{[^}]*\\}.*\\\\n.*[\"\\']\\s*\\)$"
      ],
      "so": [
       "list: an ordered and modifiable collection",
       "…",
       "class: a blueprint for creating objects"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-5",
    "t": "Rivers",
    "orig": "Rivers",
    "lvl": 1,
    "tr": "Make a dictionary containing three major rivers and the country each river runs through. One key-value pair might be <code>'nile': 'egypt'</code>. Use a loop to print a sentence about each river, such as <i>The Nile runs through Egypt</i>. Use a loop to print the name of each river. Use a loop to print the name of each country.",
    "steps": [
     {
      "f": "Create the {{rivers}} dictionary with three river-country pairs.",
      "k": {
       "rivers": [
        "Lowercase singular keys, string values.",
        "rivers = {'nile': 'egypt', 'amazon': 'brazil', 'danube': 'romania'}"
       ]
      },
      "c": "rivers = {\"nile\": \"egypt\", \"amazon\": \"brazil\", \"danube\": \"romania\"}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*[\"'].+[\"'].+\\}$"
     },
     {
      "f": "Loop over the {{pairs}} to print a sentence about each river.",
      "k": {
       "pairs": [
        "For each river and country, one f-string with both values in title case.",
        "for river, country in rivers.items():\n    print(f\"The {river.title()} runs through {country.title()}.\")"
       ]
      },
      "c": "for river, country in rivers.items():\n    print(f\"The {river.title()} runs through {country.title()}.\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "The Nile runs through Egypt.",
       "The Amazon runs through Brazil.",
       "The Danube runs through Romania."
      ]
     },
     {
      "f": "Loop over the {{keys}} to print just the names of the rivers.",
      "k": {
       "keys": [
        "The <code>.keys()</code> method returns just the keys. A for loop over a dictionary with no method behaves the same — but <code>.keys()</code> is more explicit.",
        "for river in rivers.keys():\n    print(river.title())"
       ]
      },
      "c": "for river in rivers.keys():\n    print(river.title())",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\.keys\\(\\)\\s*:$",
       "^print\\s*\\(\\s*\\w+\\.title\\(\\)\\s*\\)$"
      ],
      "so": [
       "Nile",
       "Amazon",
       "Danube"
      ]
     },
     {
      "f": "Loop over the {{values}} to print just the names of the countries.",
      "k": {
       "values": [
        "The <code>.values()</code> method returns the values. Watch out: there may be duplicates (not here).",
        "for country in rivers.values():\n    print(country.title())"
       ]
      },
      "c": "for country in rivers.values():\n    print(country.title())",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\.values\\(\\)\\s*:$",
       "^print\\s*\\(\\s*\\w+\\.title\\(\\)\\s*\\)$"
      ],
      "so": [
       "Egypt",
       "Brazil",
       "Romania"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-6",
    "t": "Polling",
    "orig": "Polling",
    "lvl": 2,
    "tr": "Use the code from <code>favorite_languages.py</code>: make a list of people who should take the poll, including some names that are already in the dictionary and some that are not. Loop through the list: if the person has already responded, thank them; otherwise invite them to take part.",
    "steps": [
     {
      "f": "Create the {{favorite_languages}} dictionary and the {{poll}} list.",
      "k": {
       "favorite_languages": [
        "The book's dictionary: key = name, value = favorite language.",
        "favorite_languages = {'jen': 'python', 'sarah': 'c', 'edward': 'rust', 'phil': 'python'}"
       ],
       "poll": [
        "The list mixes names that are already there (phil, sarah) with new ones (erin, marta).",
        "poll = ['phil', 'erin', 'sarah', 'marta']"
       ]
      },
      "c": "favorite_languages = {\"jen\": \"python\", \"sarah\": \"c\", \"edward\": \"rust\", \"phil\": \"python\"}\npoll = [\"phil\", \"erin\", \"sarah\", \"marta\"]",
      "re": [
       "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*[\"'].+[\"'].+\\}$",
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
      ]
     },
     {
      "f": "Loop over the {{list}} with a membership test against the dictionary.",
      "k": {
       "list": [
        "For each name, check with <code>in</code> whether it's already among the dictionary's keys. The if/else branches produce the two messages.",
        "for name in poll:\n    if name in favorite_languages:\n        print(f\"Thanks {name.title()}, you already responded!\")\n    else:\n        print(f\"{name.title()}, please take our poll!\")"
       ]
      },
      "c": "for name in poll:\n    if name in favorite_languages:\n        print(f\"Thanks {name.title()}, you already responded!\")\n    else:\n        print(f\"{name.title()}, please take our poll!\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^if\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Thanks Phil, you already responded!",
       "Erin, please take our poll!",
       "Thanks Sarah, you already responded!",
       "Marta, please take our poll!"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-7",
    "t": "People",
    "orig": "People",
    "lvl": 2,
    "tr": "Start with the program you wrote for Exercise 6-1. Make two new dictionaries representing different people, and store all three dictionaries in a list called <code>people</code>. Loop through your list of people. As you loop through, print everything you know about each person.",
    "steps": [
     {
      "f": "Create the three dictionaries {{person1}}, {{person2}}, {{person3}}.",
      "k": {
       "person1": [
        "Same structure as 6-1 (first_name, last_name, age, city).",
        "person1 = {'first_name': 'ada', 'last_name': 'lovelace', 'age': 36, 'city': 'london'}"
       ],
       "person2": [
        "A second person with the same structure.",
        "person2 = {'first_name': 'alan', 'last_name': 'turing', 'age': 41, 'city': 'manchester'}"
       ],
       "person3": [
        "A third person.",
        "person3 = {'first_name': 'grace', 'last_name': 'hopper', 'age': 85, 'city': 'new york'}"
       ]
      },
      "c": "person1 = {\"first_name\": \"ada\", \"last_name\": \"lovelace\", \"age\": 36, \"city\": \"london\"}\nperson2 = {\"first_name\": \"alan\", \"last_name\": \"turing\", \"age\": 41, \"city\": \"manchester\"}\nperson3 = {\"first_name\": \"grace\", \"last_name\": \"hopper\", \"age\": 85, \"city\": \"new york\"}",
      "re": [
       "^\\w+\\s*=\\s*\\{\\s*[\"']first_name[\"'].+[\"']last_name[\"'].+[\"']age[\"'].+[\"']city[\"'].*\\}$",
       "^\\w+\\s*=\\s*\\{\\s*[\"']first_name[\"'].+[\"']last_name[\"'].+[\"']age[\"'].+[\"']city[\"'].*\\}$",
       "^\\w+\\s*=\\s*\\{\\s*[\"']first_name[\"'].+[\"']last_name[\"'].+[\"']age[\"'].+[\"']city[\"'].*\\}$"
      ]
     },
     {
      "f": "Gather the three dictionaries into a {{list}}.",
      "k": {
       "list": [
        "The list is called people, as the book requires.",
        "people = [person1, person2, person3]"
       ]
      },
      "c": "people = [person1, person2, person3]",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\]$"
     },
     {
      "f": "For each person, {{print}} all the data with a nested loop.",
      "k": {
       "print": [
        "An outer loop over the people, an inner loop over each dictionary's pairs. A blank line separates each person.",
        "for person in people:\n    print(f\"\\n{person['first_name'].title()} {person['last_name'].title()}:\")\n    for key, value in person.items():\n        print(f\"  {key}: {value}\")"
       ]
      },
      "c": "for person in people:\n    print(f\"\\n{person['first_name'].title()} {person['last_name'].title()}:\")\n    for key, value in person.items():\n        print(f\"  {key}: {value}\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Ada Lovelace:",
       "  first_name: ada",
       "Alan Turing:",
       "Grace Hopper:"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-8",
    "t": "Pets",
    "orig": "Pets",
    "lvl": 2,
    "tr": "Make several dictionaries, where each dictionary represents a different pet. In each dictionary, include the kind of animal and the owner's name. Store the dictionaries in a list called <code>pets</code>, and loop through the list, printing everything you know about each pet.",
    "steps": [
     {
      "f": "Create the dictionaries {{pet1}}, {{pet2}}, {{pet3}}.",
      "k": {
       "pet1": [
        "Keys like kind and owner, with string values.",
        "pet1 = {'kind': 'dog', 'owner': 'luca'}"
       ],
       "pet2": [
        "Same structure.",
        "pet2 = {'kind': 'cat', 'owner': 'sara'}"
       ],
       "pet3": [
        "Same structure.",
        "pet3 = {'kind': 'rabbit', 'owner': 'marco'}"
       ]
      },
      "c": "pet1 = {\"kind\": \"dog\", \"owner\": \"luca\"}\npet2 = {\"kind\": \"cat\", \"owner\": \"sara\"}\npet3 = {\"kind\": \"rabbit\", \"owner\": \"marco\"}",
      "re": [
       "^\\w+\\s*=\\s*\\{\\s*[\"']kind[\"'].+[\"']owner[\"'].*\\}$",
       "^\\w+\\s*=\\s*\\{\\s*[\"']kind[\"'].+[\"']owner[\"'].*\\}$",
       "^\\w+\\s*=\\s*\\{\\s*[\"']kind[\"'].+[\"']owner[\"'].*\\}$"
      ]
     },
     {
      "f": "Gather the three dictionaries into a {{pets}} list.",
      "k": {
       "pets": [
        "The exact name the book requires.",
        "pets = [pet1, pet2, pet3]"
       ]
      },
      "c": "pets = [pet1, pet2, pet3]",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\]$"
     },
     {
      "f": "For each pet, {{print}} the kind and the owner.",
      "k": {
       "print": [
        "A loop + an f-string with key access. A blank line between one pet and the next.",
        "for pet in pets:\n    print(f\"\\nI have a {pet['kind']}, and its owner is {pet['owner'].title()}.\")"
       ]
      },
      "c": "for pet in pets:\n    print(f\"\\nI have a {pet['kind']}, and its owner is {pet['owner'].title()}.\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "I have a dog, and its owner is Luca.",
       "I have a cat, and its owner is Sara.",
       "I have a rabbit, and its owner is Marco."
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-9",
    "t": "Favorite Places",
    "orig": "Favorite Places",
    "lvl": 2,
    "tr": "Make a dictionary called <code>favorite_places</code>. Think of three names to use as keys, and store one to three favorite places for each person. Loop through the dictionary, printing the name of each person and their favorite places.",
    "steps": [
     {
      "f": "Create the {{favorite_places}} dictionary with three names as keys.",
      "k": {
       "favorite_places": [
        "The values are <b>lists</b>: here's your first taste of nesting (a list inside a dictionary).",
        "favorite_places = {'marie': ['paris', 'london'], 'alan': ['cambridge'], 'ada': ['turin', 'milan', 'rome']}"
       ]
      },
      "c": "favorite_places = {\"marie\": [\"paris\", \"london\"], \"alan\": [\"cambridge\"], \"ada\": [\"turin\", \"milan\", \"rome\"]}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*\\[.+\\].+\\}$"
     },
     {
      "f": "Outer loop over the dictionary's {{pairs}}.",
      "k": {
       "pairs": [
        "For each person, we print a header and then loop through their list of places.",
        "for name, places in favorite_places.items():\n    print(f\"\\n{name.title()}'s favorite places:\")"
       ]
      },
      "c": "for name, places in favorite_places.items():\n    print(f\"\\n{name.title()}'s favorite places:\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Add the {{inner}} loop over each person's list.",
      "k": {
       "inner": [
        "Indented 4 more spaces than the outer for. Prints one place per line, with a visual indent.",
        "    for place in places:\n        print(f\"  - {place.title()}\")"
       ]
      },
      "c": "    for place in places:\n        print(f\"  - {place.title()}\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Marie's favorite places:",
       "  - Paris",
       "  - London",
       "Alan's favorite places:",
       "  - Cambridge",
       "Ada's favorite places:",
       "  - Turin",
       "  - Milan",
       "  - Rome"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-10",
    "t": "Favorite Numbers (multiple)",
    "orig": "Favorite Numbers (multiple)",
    "lvl": 2,
    "tr": "Modify the program from Exercise 6-2 so that each person can have more than one favorite number. Print each person's name along with their favorite numbers.",
    "steps": [
     {
      "f": "Create the {{favorite_numbers}} dictionary with lists of numbers as values.",
      "k": {
       "favorite_numbers": [
        "Each value is a list of integers. Anyone with a single number has a one-element list.",
        "favorite_numbers = {'marie': [7, 13], 'alan': [42], 'ada': [3, 11, 17]}"
       ]
      },
      "c": "favorite_numbers = {\"marie\": [7, 13], \"alan\": [42], \"ada\": [3, 11, 17]}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*\\[.+\\].+\\}$"
     },
     {
      "f": "For each person, {{print}} the name and the list of numbers.",
      "k": {
       "print": [
        "An outer loop + an f-string that shows the list as it is. As an alternative, you can loop over the elements like in 6-9.",
        "for name, numbers in favorite_numbers.items():\n    print(f\"\\n{name.title()}'s favorite numbers:\")\n    for n in numbers:\n        print(f\"  - {n}\")"
       ]
      },
      "c": "for name, numbers in favorite_numbers.items():\n    print(f\"\\n{name.title()}'s favorite numbers:\")\n    for n in numbers:\n        print(f\"  - {n}\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Marie's favorite numbers:",
       "  - 7",
       "  - 13",
       "Alan's favorite numbers:",
       "  - 42"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-11",
    "t": "Cities",
    "orig": "Cities",
    "lvl": 3,
    "tr": "Make a dictionary called <code>cities</code>. Use the names of three cities as keys. For each city, make a dictionary containing the country, the approximate population, and one fact about that city (keys like <code>country</code>, <code>population</code>, <code>fact</code>). Print the name of each city and all the information you have stored about it.",
    "steps": [
     {
      "f": "Create the {{cities}} dictionary with three cities as keys.",
      "k": {
       "cities": [
        "Each value is a <b>nested dictionary</b>: keys country, population, fact. Watch out for the doubled curly braces.",
        "cities = {'tokyo': {'country': 'japan', 'population': 14000000, 'fact': 'the busiest subway in the world'}, 'reykjavik': {'country': 'iceland', 'population': 130000, 'fact': 'heated 100% by geothermal energy'}, 'cairo': {'country': 'egypt', 'population': 21000000, 'fact': 'the largest city in the Arab world'}}"
       ]
      },
      "c": "cities = {\"tokyo\": {\"country\": \"japan\", \"population\": 14000000, \"fact\": \"the busiest subway in the world\"}, \"reykjavik\": {\"country\": \"iceland\", \"population\": 130000, \"fact\": \"heated 100% by geothermal energy\"}, \"cairo\": {\"country\": \"egypt\", \"population\": 21000000, \"fact\": \"the largest city in the Arab world\"}}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*\\{.+\\}.+\\}$"
     },
     {
      "f": "Outer loop over the {{cities}}, accessing the inner dictionary.",
      "k": {
       "cities": [
        "For each city, the value is a dictionary. We print a header and access the inner keys with <code>cities[name]['country']</code> and so on.",
        "for name, info in cities.items():\n    print(f\"\\n{name.title()}:\")\n    print(f\"  Country: {info['country'].title()}\")\n    print(f\"  Population: {info['population']:,}\")\n    print(f\"  Fact: {info['fact']}\")"
       ]
      },
      "c": "for name, info in cities.items():\n    print(f\"\\n{name.title()}:\")\n    print(f\"  Country: {info['country'].title()}\")\n    print(f\"  Population: {info['population']:,}\")\n    print(f\"  Fact: {info['fact']}\")",
      "re": [
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Tokyo:",
       "  Country: Japan",
       "  Population: 14,000,000",
       "  Fact: the busiest subway in the world"
      ]
     }
    ],
    "ch": 6
   },
   {
    "id": "6-12",
    "t": "Extensions",
    "orig": "Extensions",
    "lvl": 3,
    "tr": "Now that you're working with fairly complex examples, you can extend them in many ways. Choose one of the example programs from this chapter and expand it by adding new keys and values, changing the context, or improving the formatting of the output.",
    "steps": [
     {
      "f": "Choose a {{program}} from the chapter and describe the change you want to make.",
      "k": {
       "program": [
        "Examples: the glossary with images, favorite places with coordinates, cities with more facts.",
        "e.g. \"I add the date each term was learned to the glossary\""
       ]
      },
      "c": null,
      "ta": "Describe the change you want to make (min 20 characters)…",
      "min": 20
     },
     {
      "f": "Apply the change in your {{editor}} and check that it works.",
      "k": {
       "editor": [
        "Take the code of the exercise you chose, apply your change here, then press \"Run\" to see the result.",
        "# example: glossary with dates\nglossary = {'list': ('an ordered collection', '2026-10-15'), …}"
       ]
      },
      "c": null,
      "btn": "✓ Change applied"
     }
    ],
    "ch": 6
   }
  ]
 },
 {
  "n": 7,
  "t": "User Input and while Loops",
  "sub": "Interacting with the user and conditional iteration",
  "concepts": [
   "The input() function and the prompt",
   "int() to convert input to a number",
   "The modulo operator % and its uses",
   "The while loop and its exit condition",
   "Active flags, break, and continue",
   "Infinite loops and how to avoid them",
   "while loops with lists and dictionaries"
  ],
  "ex": [
   {
    "id": "7-1",
    "t": "Rental Car",
    "orig": "Rental Car",
    "lvl": 1,
    "tr": "Write a program that asks the user what kind of rental car they would like. Print a message about that car, such as <i>“Let me see if I can find you a Subaru”</i>.",
    "steps": [
     {
      "f": "Ask the user what kind of car they want with {{input()}}.",
      "k": {
       "input()": [
        "<code>input()</code> displays a prompt and returns whatever the user types, <b>always as a string</b>. It's best to store the result in a variable.",
        "car = input(\"What kind of rental car would you like? \")"
       ]
      },
      "c": "car = input(\"What kind of rental car would you like? \")",
      "re": "^\\w+\\s*=\\s*input\\(\\s*[\"'].+[\"']\\s*\\)$"
     },
     {
      "f": "Print the message with an {{f-string}} that includes the answer.",
      "k": {
       "f-string": [
        "In the f-string, use the variable returned by input(): <code>{car}</code>. <code>.title()</code> makes the model name look nicer.",
        "print(f\"Let me see if I can find you a {car.title()}.\")"
       ]
      },
      "c": "print(f\"Let me see if I can find you a {car.title()}.\")",
      "re": "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
      "note": "The browser runtime doesn't provide input: input() will return an empty string. Run it locally in VS Code for the full behavior."
     }
    ],
    "ch": 7
   },
   {
    "id": "7-2",
    "t": "Restaurant Seating",
    "orig": "Restaurant Seating",
    "lvl": 1,
    "tr": "Write a program that asks the user how many people are in their dinner group. If the answer is more than eight, print a message saying they'll have to wait for a table. Otherwise, report that their table is ready.",
    "steps": [
     {
      "f": "Ask how many {{people}} are in the dinner group and convert the answer to an integer.",
      "k": {
       "people": [
        "<code>input()</code> returns a string: you need <code>int()</code> to compare it numerically. Without the conversion you'll get a TypeError.",
        "people = int(input(\"How many people are in your dinner group? \"))"
       ]
      },
      "c": "people = int(input(\"How many people are in your dinner group? \"))",
      "re": "^\\w+\\s*=\\s*int\\(\\s*input\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
     },
     {
      "f": "Write the {{condition}} with if/else: more than 8 means a wait, otherwise the table is ready.",
      "k": {
       "condition": [
        "The numeric comparison works now: <code>people > 8</code>. Two different messages in the two branches.",
        "if people > 8:\n    print(\"You'll have to wait for a table.\")\nelse:\n    print(\"Your table is ready!\")"
       ]
      },
      "c": "if people > 8:\n    print(\"You'll have to wait for a table.\")\nelse:\n    print(\"Your table is ready!\")",
      "re": [
       "^if\\s+\\w+\\s*>\\s*8\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "note": "As in 7-1: real input only works when you run the program locally."
     }
    ],
    "ch": 7
   },
   {
    "id": "7-3",
    "t": "Multiples of Ten",
    "orig": "Multiples of Ten",
    "lvl": 1,
    "tr": "Ask the user for a number and report whether it's a multiple of 10 or not.",
    "steps": [
     {
      "f": "Ask for the {{number}} and convert it to an integer.",
      "k": {
       "number": [
        "Same as in 7-2: input + int().",
        "number = int(input(\"Enter a number: \"))"
       ]
      },
      "c": "number = int(input(\"Enter a number: \"))",
      "re": "^\\w+\\s*=\\s*int\\(\\s*input\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
     },
     {
      "f": "Use the {{module}} operator for the test.",
      "k": {
       "module": [
        "A number is a multiple of 10 when the remainder of the division by 10 is zero: <code>number % 10 == 0</code>.",
        "if number % 10 == 0:\n    print(f\"{number} is a multiple of 10.\")\nelse:\n    print(f\"{number} is not a multiple of 10.\")"
       ]
      },
      "c": "if number % 10 == 0:\n    print(f\"{number} is a multiple of 10.\")\nelse:\n    print(f\"{number} is not a multiple of 10.\")",
      "re": [
       "^if\\s+\\w+\\s*%\\s*10\\s*==\\s*0\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 7
   },
   {
    "id": "7-4",
    "t": "Pizza Toppings",
    "orig": "Pizza Toppings",
    "lvl": 2,
    "tr": "Write a loop that prompts the user for a series of pizza toppings until they enter 'quit'. For each topping, print a message saying you'll add it to their pizza.",
    "steps": [
     {
      "f": "Initialize the {{prompt}} with the exit instructions.",
      "k": {
       "prompt": [
        "The prompt should contain both the request and the instruction for quitting. It's worth storing it in a variable so you don't repeat it.",
        "prompt = \"\\nEnter a topping (type 'quit' to exit): \""
       ]
      },
      "c": "prompt = \"\\nEnter a topping (type 'quit' to exit): \"",
      "re": "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
     },
     {
      "f": "A {{while}} loop that keeps going until the user types quit.",
      "k": {
       "while": [
        "Approach 1: <code>while True</code> with an explicit <code>break</code>. Approach 2: a flag variable (e.g. <code>active = True</code>). Pick one of the two.",
        "while True:\n    topping = input(prompt)\n    if topping == 'quit':\n        break\n    print(f\"I'll add {topping} to your pizza.\")"
       ]
      },
      "c": "while True:\n    topping = input(prompt)\n    if topping == 'quit':\n        break\n    print(f\"I'll add {topping} to your pizza.\")",
      "re": [
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(\\s*\\w+\\s*\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "note": "The browser runtime doesn't provide input: the loop will immediately receive an empty string. Run it in VS Code to try it out."
     }
    ],
    "ch": 7
   },
   {
    "id": "7-5",
    "t": "Movie Tickets",
    "orig": "Movie Tickets",
    "lvl": 2,
    "tr": "A movie theater charges different prices by age: under 3 gets in free, ages 3 to 12 cost $10, and over 12 costs $15. Write a loop that asks for the user's age and tells them the price of their ticket.",
    "steps": [
     {
      "f": "A {{while}} loop that asks for the age until the user enters 'quit'.",
      "k": {
       "while": [
        "A <code>while True</code> loop with a break on 'quit'. Convert the age input to int ONLY after checking that it isn't 'quit'.",
        "while True:\n    age_input = input(\"How old are you? ('quit' to exit): \")\n    if age_input == 'quit':\n        break\n    age = int(age_input)"
       ]
      },
      "c": "while True:\n    age_input = input(\"How old are you? ('quit' to exit): \")\n    if age_input == 'quit':\n        break\n    age = int(age_input)",
      "re": [
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^\\w+\\s*=\\s*int\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Add the if/elif/else {{chain}} for the price.",
      "k": {
       "chain": [
        "Everything goes inside the loop, indented by 4 spaces. Watch the boundaries: under 3 is free, 3≤age≤12 → $10, over 12 → $15.",
        "    if age < 3:\n        print(\"Your ticket is free!\")\n    elif age <= 12:\n        print(\"Your ticket is $10.\")\n    else:\n        print(\"Your ticket is $15.\")"
       ]
      },
      "c": "    if age < 3:\n        print(\"Your ticket is free!\")\n    elif age <= 12:\n        print(\"Your ticket is $10.\")\n    else:\n        print(\"Your ticket is $15.\")",
      "re": [
       "^if\\s+\\w+\\s*<\\s*3\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^elif\\s+\\w+\\s*<=\\s*12\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^else\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     }
    ],
    "ch": 7
   },
   {
    "id": "7-6",
    "t": "Three Exits",
    "orig": "Three Exits",
    "lvl": 2,
    "tr": "Write different versions of Exercise 7-4 or 7-5 that do each of the following at least once: use a conditional test in the while statement, use a flag variable, use a break statement.",
    "steps": [
     {
      "f": "Version 1: {{direct}} condition in the while statement.",
      "k": {
       "direct": [
        "Approach: initialize the variable, then <code>while variable != 'quit'</code>. The exit condition is in the while statement itself.",
        "message = \"\"\nwhile message != 'quit':\n    message = input(\"Enter a message (quit to exit): \")\n    if message != 'quit':\n        print(message)"
       ]
      },
      "c": "message = \"\"\nwhile message != \"quit\":\n    message = input(\"Enter a message (quit to exit): \")\n    if message != \"quit\":\n        print(message)",
      "re": [
       "^\\w+\\s*=\\s*[\"']{2}\\s*$",
       "^while\\s+\\w+\\s*!=\\s*[\"']quit[\"']\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*!=\\s*[\"']quit[\"']\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Version 2: an active {{flag}} controls the loop.",
      "k": {
       "flag": [
        "A boolean variable <code>active = True</code>. Inside the loop, the if that checks for 'quit' sets <code>active = False</code>. The while statement checks only the flag.",
        "active = True\nwhile active:\n    message = input(\"Enter a message (quit to exit): \")\n    if message == 'quit':\n        active = False\n    else:\n        print(message)"
       ]
      },
      "c": "active = True\nwhile active:\n    message = input(\"Enter a message (quit to exit): \")\n    if message == \"quit\":\n        active = False\n    else:\n        print(message)",
      "re": [
       "^\\w+\\s*=\\s*True\\s*$",
       "^while\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^\\w+\\s*=\\s*False\\s*$",
       "^else\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Version 3: {{break}} to exit.",
      "k": {
       "break": [
        "The most direct: <code>while True</code> + break. No other condition in the while statement.",
        "while True:\n    message = input(\"Enter a message (quit to exit): \")\n    if message == 'quit':\n        break\n    print(message)"
       ]
      },
      "c": "while True:\n    message = input(\"Enter a message (quit to exit): \")\n    if message == \"quit\":\n        break\n    print(message)",
      "re": [
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     }
    ],
    "ch": 7
   },
   {
    "id": "7-7",
    "t": "Infinity",
    "orig": "Infinity",
    "lvl": 1,
    "tr": "Write a loop that never ends and run it. (To stop it when running locally, press CTRL-C or close the window.)",
    "steps": [
     {
      "f": "Write a {{while True}} without a break.",
      "k": {
       "while True": [
        "A <code>while True:</code> loop with no break or return runs forever. In the browser runtime, the 8-second watchdog will stop it.",
        "while True:\n    print(\"This loop never ends!\")"
       ]
      },
      "c": "while True:\n    print(\"This loop never ends!\")",
      "re": [
       "^while\\s+True\\s*:$",
       "^print\\s*\\(.+\\)$"
      ],
      "note": "Run it: the 8-second watchdog will interrupt the runtime and you'll see the timeout message. It's the infinite-loop protection."
     }
    ],
    "ch": 7
   },
   {
    "id": "7-8",
    "t": "Deli",
    "orig": "Deli",
    "lvl": 2,
    "tr": "Make a list called <code>sandwich_orders</code> with the names of several sandwiches and an empty list called <code>finished_sandwiches</code>. Loop through the sandwich orders and print a message for each order, such as <i>“I made your tuna sandwich”</i>. As each sandwich is made, move it to the list of finished sandwiches. After all the sandwiches have been made, print a message listing each sandwich that was made.",
    "steps": [
     {
      "f": "Create the two lists {{sandwich_orders}} and {{finished_sandwiches}}.",
      "k": {
       "sandwich_orders": [
        "The list of orders, with at least 3 items.",
        "sandwich_orders = ['tuna', 'ham', 'veggie']"
       ],
       "finished_sandwiches": [
        "The empty list that will hold the finished sandwiches.",
        "finished_sandwiches = []"
       ]
      },
      "c": "sandwich_orders = [\"tuna\", \"ham\", \"veggie\"]\nfinished_sandwiches = []",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\]$"
      ]
     },
     {
      "f": "{{while}} loop over the non-empty list: pop, print, append.",
      "k": {
       "while": [
        "<code>while sandwich_orders:</code> is True as long as the list isn't empty. Inside: <code>pop()</code> takes the last item, you print a message, and you <code>append()</code> it to the list of finished sandwiches.",
        "while sandwich_orders:\n    sandwich = sandwich_orders.pop()\n    print(f\"I made your {sandwich} sandwich.\")\n    finished_sandwiches.append(sandwich)"
       ]
      },
      "c": "while sandwich_orders:\n    sandwich = sandwich_orders.pop()\n    print(f\"I made your {sandwich} sandwich.\")\n    finished_sandwiches.append(sandwich)",
      "re": [
       "^while\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^\\w+\\.append\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "At the end, {{print}} the finished sandwiches.",
      "k": {
       "print": [
        "An unindented line, after the while loop. A short summary loop.",
        "print(\"\\nSandwiches made:\")\nfor p in finished_sandwiches:\n    print(f\"  - {p}\")"
       ]
      },
      "c": "print(\"\\nSandwiches made:\")\nfor p in finished_sandwiches:\n    print(f\"  - {p}\")",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "I made your veggie sandwich.",
       "I made your ham sandwich.",
       "I made your tuna sandwich.",
       "Sandwiches made:",
       "  - veggie",
       "  - ham",
       "  - tuna"
      ]
     }
    ],
    "ch": 7
   },
   {
    "id": "7-9",
    "t": "No Pastrami",
    "orig": "No Pastrami",
    "lvl": 2,
    "tr": "Using the sandwich_orders list from Exercise 7-8, make sure the sandwich 'pastrami' appears in the list at least three times. Add code near the beginning of your program to print a message saying the deli has run out of pastrami, and use a while loop to remove all occurrences of 'pastrami' from the list. Make sure no pastrami sandwiches end up in finished_sandwiches.",
    "steps": [
     {
      "f": "Add three {{pastrami}} entries to the list of orders.",
      "k": {
       "pastrami": [
        "Scattered among the other orders.",
        "sandwich_orders = ['tuna', 'pastrami', 'ham', 'pastrami', 'veggie', 'pastrami']"
       ]
      },
      "c": "sandwich_orders = [\"tuna\", \"pastrami\", \"ham\", \"pastrami\", \"veggie\", \"pastrami\"]\nfinished_sandwiches = []",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\]$"
      ]
     },
     {
      "f": "Announce that the pastrami is {{done}}.",
      "k": {
       "done": [
        "A print statement before the loop.",
        "print(\"The deli has run out of pastrami.\")"
       ]
      },
      "c": "print(\"The deli has run out of pastrami.\")",
      "re": "^print\\s*\\(.+\\)$"
     },
     {
      "f": "Remove {{all}} occurrences of pastrami with a while loop.",
      "k": {
       "all": [
        "<code>while 'pastrami' in sandwich_orders:</code> + <code>remove('pastrami')</code>. A single if isn't enough: the while loop repeats until none are left.",
        "while 'pastrami' in sandwich_orders:\n    sandwich_orders.remove('pastrami')"
       ]
      },
      "c": "while \"pastrami\" in sandwich_orders:\n    sandwich_orders.remove(\"pastrami\")",
      "re": [
       "^while\\s+[\"']pastrami[\"']\\s+in\\s+\\w+\\s*:$",
       "^\\w+\\.remove\\(\\s*[\"']pastrami[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Preparation loop {{without}} pastrami.",
      "k": {
       "without": [
        "Identical to 7-8: pop, print, append. Now the list contains no pastrami.",
        "while sandwich_orders:\n    sandwich = sandwich_orders.pop()\n    print(f\"I made your {sandwich} sandwich.\")\n    finished_sandwiches.append(sandwich)"
       ]
      },
      "c": "while sandwich_orders:\n    sandwich = sandwich_orders.pop()\n    print(f\"I made your {sandwich} sandwich.\")\n    finished_sandwiches.append(sandwich)",
      "re": [
       "^while\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^\\w+\\.append\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "The deli has run out of pastrami.",
       "I made your veggie sandwich.",
       "I made your ham sandwich.",
       "I made your tuna sandwich."
      ]
     }
    ],
    "ch": 7
   },
   {
    "id": "7-10",
    "t": "Dream Vacation",
    "orig": "Dream Vacation",
    "lvl": 3,
    "tr": "Write a program that polls users about their dream vacation. Write a prompt such as <i>“If you could visit one place in the world, where would you go?”</i>. Include a block of code that prints the results of the poll.",
    "steps": [
     {
      "f": "Initialize an empty {{dictionary}} and an active flag.",
      "k": {
       "dictionary": [
        "The dictionary will hold name → destination. The flag keeps track of whether to keep polling.",
        "responses = {}\nactive = True"
       ]
      },
      "c": "responses = {}\nactive = True",
      "re": [
       "^\\w+\\s*=\\s*\\{\\s*\\}$",
       "^\\w+\\s*=\\s*True\\s*$"
      ]
     },
     {
      "f": "A {{while}} loop with input for the name, the destination, and whether to continue.",
      "k": {
       "while": [
        "Inside the loop: ask for the name, ask for the destination, store it in the dictionary, ask whether to continue, and update the flag accordingly.",
        "while active:\n    name = input(\"What's your name? \")\n    destination = input(\"Where would you like to go? \")\n    responses[name] = destination\n    repeat = input(\"Continue? (yes/no) \")\n    if repeat == 'no':\n        active = False"
       ]
      },
      "c": "while active:\n    name = input(\"What's your name? \")\n    destination = input(\"Where would you like to go? \")\n    responses[name] = destination\n    repeat = input(\"Continue? (yes/no) \")\n    if repeat == \"no\":\n        active = False",
      "re": [
       "^while\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\[\\s*\\w+\\s*\\]\\s*=\\s*\\w+$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']no[\"']\\s*:$",
       "^\\w+\\s*=\\s*False\\s*$"
      ]
     },
     {
      "f": "Print the poll {{results}} with a loop.",
      "k": {
       "results": [
        "After the while loop, loop over .items() to show each name → destination.",
        "print(\"\\n--- Poll Results ---\")\nfor name, destination in responses.items():\n    print(f\"{name.title()} would like to go to {destination.title()}.\")"
       ]
      },
      "c": "print(\"\\n--- Poll Results ---\")\nfor name, destination in responses.items():\n    print(f\"{name.title()} would like to go to {destination.title()}.\")",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 7
   }
  ]
 },
 {
  "n": 8,
  "t": "Functions",
  "sub": "Named blocks of code, arguments, and return values",
  "concepts": [
   "def and function calls",
   "Parameters and arguments (positional and keyword)",
   "Default values",
   "return and return values",
   "Functions with lists, dictionaries, and loops",
   "Arbitrary arguments (*args, **kwargs)",
   "Modules and imports",
   "Styling functions"
  ],
  "ex": [
   {
    "id": "8-1",
    "t": "Message",
    "orig": "Message",
    "lvl": 1,
    "tr": "Write a function called <code>display_message()</code> that prints one sentence telling everyone what you are learning about in this chapter. Call the function, and make sure the message displays correctly.",
    "steps": [
     {
      "f": "Define the {{function}} with def and empty parentheses.",
      "k": {
       "function": [
        "<code>def function_name():</code> introduces the definition. The body should be indented by 4 spaces. The docstring describes the function.",
        "def display_message():\n    \"\"\"Display a message about the chapter topic.\"\"\"\n    print(\"I'm learning functions in Python!\")"
       ]
      },
      "c": "def display_message():\n    \"\"\"Display a message about the chapter topic.\"\"\"\n    print(\"I'm learning functions in Python!\")",
      "re": [
       "^def\\s+\\w+\\(\\)\\s*:$",
       "^\"\"\".*\"\"\"$",
       "^print\\s*\\(.+\\)$"
      ]
     },
     {
      "f": "Call the function {{by name}}.",
      "k": {
       "by name": [
        "The call is the name followed by parentheses: <code>display_message()</code>. Without parentheses, you don't execute anything!",
        "display_message()"
       ]
      },
      "c": "display_message()",
      "re": "^\\w+\\(\\)\\s*$",
      "so": [
       "I'm learning functions in Python!"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-2",
    "t": "Favorite Book",
    "orig": "Favorite Book",
    "lvl": 1,
    "tr": "Write a function called <code>favorite_book()</code> that accepts one parameter, <code>title</code>. The function should print a message such as <i>\"One of my favorite books is Alice in Wonderland\"</i>. Call the function, making sure to include a book title as an argument in the function call.",
    "steps": [
     {
      "f": "Define the function with the {{parameter}} title.",
      "k": {
       "parameter": [
        "The parameter goes between the parentheses: <code>def favorite_book(title):</code>. It is a variable local to the function.",
        "def favorite_book(title):\n    print(f\"One of my favorite books is {title.title()}.\")"
       ]
      },
      "c": "def favorite_book(title):\n    print(f\"One of my favorite books is {title.title()}.\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call the function, passing in a {{title}}.",
      "k": {
       "title": [
        "The value between the parentheses is the argument: <code>favorite_book(\"alice in wonderland\")</code>.",
        "favorite_book(\"alice in wonderland\")"
       ]
      },
      "c": "favorite_book(\"alice in wonderland\")",
      "re": "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "One of my favorite books is Alice In Wonderland."
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-3",
    "t": "T-Shirt",
    "orig": "T-Shirt",
    "lvl": 2,
    "tr": "Write a function called <code>make_shirt()</code> that accepts a size and the text of a message that should be printed on the shirt. The function should print a sentence summarizing the size of the shirt and the message printed on it. Call the function once using positional arguments to make a shirt, and once using keyword arguments.",
    "steps": [
     {
      "f": "Define the function with two {{parameters}}.",
      "k": {
       "parameters": [
        "Two parameters: one for the size, one for the message.",
        "def make_shirt(size, message):\n    print(f\"I'm making a size {size} shirt with the message: '{message}'.\")"
       ]
      },
      "c": "def make_shirt(size, message):\n    print(f\"I'm making a size {size} shirt with the message: '{message}'.\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call it with {{positional}} arguments.",
      "k": {
       "positional": [
        "Order matters: size first, message after.",
        "make_shirt(\"M\", \"Python forever!\")"
       ]
      },
      "c": "make_shirt(\"M\", \"Python forever!\")",
      "re": "^\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "I'm making a size M shirt with the message: 'Python forever!'."
      ]
     },
     {
      "f": "Call it with {{keyword}} arguments.",
      "k": {
       "keyword": [
        "Order doesn't matter: <code>make_shirt(message=\"...\", size=\"L\")</code>. Clarity improves.",
        "make_shirt(message=\"I'm a programmer\", size=\"L\")"
       ]
      },
      "c": "make_shirt(message=\"I'm a programmer\", size=\"L\")",
      "re": "^\\w+\\(\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "I'm making a size L shirt with the message: 'I'm a programmer'."
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-4",
    "t": "Large Shirts",
    "orig": "Large Shirts",
    "lvl": 2,
    "tr": "Modify the make_shirt() function so that shirts are large by default, with a message that reads <i>I love Python</i>. Make a large shirt and a medium shirt with the default message, and a shirt of any size with a different message.",
    "steps": [
     {
      "f": "Add {{default values}} to the parameters.",
      "k": {
       "default values": [
        "Parameters with defaults come AFTER those without. Here both can have defaults.",
        "def make_shirt(size=\"L\", message=\"I love Python\"):\n    print(f\"I'm making a size {size} shirt with the message: '{message}'.\")"
       ]
      },
      "c": "def make_shirt(size=\"L\", message=\"I love Python\"):\n    print(f\"I'm making a size {size} shirt with the message: '{message}'.\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call the function {{with no arguments}} (all defaults).",
      "k": {
       "with no arguments": [
        "If I omit both, the function uses the defaults.",
        "make_shirt()"
       ]
      },
      "c": "make_shirt()",
      "re": "^\\w+\\(\\)\\s*$",
      "so": [
       "I'm making a size L shirt with the message: 'I love Python'."
      ]
     },
     {
      "f": "Call it with a different {{size}}, default message.",
      "k": {
       "size": [
        "A single argument: the message stays at its default.",
        "make_shirt(\"M\")"
       ]
      },
      "c": "make_shirt(\"M\")",
      "re": "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "I'm making a size M shirt with the message: 'I love Python'."
      ]
     },
     {
      "f": "Call it with a different size and {{message}}.",
      "k": {
       "message": [
        "Two arguments: both defaults are overridden.",
        "make_shirt(size=\"S\", message=\"My first script\")"
       ]
      },
      "c": "make_shirt(size=\"S\", message=\"My first script\")",
      "re": "^\\w+\\(\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*\\)$",
      "so": [
       "I'm making a size S shirt with the message: 'My first script'."
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-5",
    "t": "Cities",
    "orig": "Cities",
    "lvl": 2,
    "tr": "Write a function called <code>describe_city()</code> that accepts the name of a city and its country. The function should print a simple sentence, such as <i>\"Reykjavik is in Iceland\"</i>. Give the parameter for the country a default value. Call your function for three different cities, at least one of which is not in the default country.",
    "steps": [
     {
      "f": "Define the function with a default for the {{country}}.",
      "k": {
       "country": [
        "The city parameter (no default) comes first, country (with default) after: Python makes this order mandatory.",
        "def describe_city(city, country=\"iceland\"):\n    print(f\"{city.title()} is in {country.title()}.\")"
       ]
      },
      "c": "def describe_city(city, country=\"iceland\"):\n    print(f\"{city.title()} is in {country.title()}.\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*[\"'].+[\"']\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call it for three cities, {{at least one}} outside the default country.",
      "k": {
       "at least one": [
        "Two Icelandic cities (default), one French (override).",
        "describe_city(\"reykjavik\")\ndescribe_city(\"akureyri\")\ndescribe_city(\"paris\", \"france\")"
       ]
      },
      "c": "describe_city(\"reykjavik\")\ndescribe_city(\"akureyri\")\ndescribe_city(\"paris\", \"france\")",
      "re": [
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "so": [
       "Reykjavik is in Iceland.",
       "Akureyri is in Iceland.",
       "Paris is in France."
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-6",
    "t": "City Names",
    "orig": "City Names",
    "lvl": 2,
    "tr": "Write a function called <code>city_country()</code> that takes in the name of a city and its country. The function should return a string formatted like this: <code>\"Santiago, Chile\"</code>. Call your function with at least three city-country pairs, and print the values that are returned.",
    "steps": [
     {
      "f": "Define the function that {{returns}} a string.",
      "k": {
       "returns": [
        "<code>return</code> sends a value back to the caller; it does <b>not</b> print anything. The caller will decide what to do with it.",
        "def city_country(city, country):\n    return f\"{city.title()}, {country.title()}\""
       ]
      },
      "c": "def city_country(city, country):\n    return f\"{city.title()}, {country.title()}\"",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^return\\s+f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*$"
      ]
     },
     {
      "f": "Call it three times and {{print}} the result.",
      "k": {
       "print": [
        "Each call is an expression: you can pass it directly to print().",
        "print(city_country(\"santiago\", \"chile\"))\nprint(city_country(\"tokyo\", \"japan\"))\nprint(city_country(\"reykjavik\", \"iceland\"))"
       ]
      },
      "c": "print(city_country(\"santiago\", \"chile\"))\nprint(city_country(\"tokyo\", \"japan\"))\nprint(city_country(\"reykjavik\", \"iceland\"))",
      "re": [
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
      ],
      "so": [
       "Santiago, Chile",
       "Tokyo, Japan",
       "Reykjavik, Iceland"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-7",
    "t": "Album",
    "orig": "Album",
    "lvl": 3,
    "tr": "Write a function called <code>make_album()</code> that builds a dictionary describing a music album. The function should take in an artist name and an album title, and it should return a dictionary containing these two pieces of information. Use the function to make three dictionaries representing different albums. Print each return value to show that the dictionaries are storing the album information correctly. Use <code>None</code> to add an optional parameter to make_album() that allows you to store the number of songs on an album. If the calling line includes a value for the number of songs, add that value to the album's dictionary. Make at least one new function call that includes the number of songs on an album.",
    "steps": [
     {
      "f": "Define the function with the optional {{None}} parameter.",
      "k": {
       "None": [
        "The <code>songs=None</code> parameter means \"not specified\". If the call provides it, we add it; otherwise we don't.",
        "def make_album(artist, album_title, songs=None):\n    album = {\"artist\": artist, \"album_title\": album_title}\n    if songs:\n        album[\"songs\"] = songs\n    return album"
       ]
      },
      "c": "def make_album(artist, album_title, songs=None):\n    album = {\"artist\": artist, \"album_title\": album_title}\n    if songs:\n        album[\"songs\"] = songs\n    return album",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*None\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*\\{\\s*[\"\\']artist[\"\\']\\s*:\\s*.+,\\s*[\"\\']album_title[\"\\']\\s*:\\s*.+\\s*\\}$",
       "^if\\s+\\w+:$",
       "^\\w+\\[\\s*[\"\\']songs[\"\\']\\s*\\]\\s*=\\s*\\w+$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "Create {{three albums}} and print them.",
      "k": {
       "three albums": [
        "Calls without the third argument (songs omitted) and with the third argument.",
        "print(make_album(\"pink floyd\", \"the dark side of the moon\"))\nprint(make_album(\"daft punk\", \"random access memories\", 10))\nprint(make_album(\"miles davis\", \"kind of blue\"))"
       ]
      },
      "c": "print(make_album(\"pink floyd\", \"the dark side of the moon\"))\nprint(make_album(\"daft punk\", \"random access memories\", 10))\nprint(make_album(\"miles davis\", \"kind of blue\"))",
      "re": [
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
      ],
      "so": [
       "{'artist': 'pink floyd', 'album_title': 'the dark side of the moon'}",
       "{'artist': 'daft punk', 'album_title': 'random access memories', 'songs': 10}",
       "{'artist': 'miles davis', 'album_title': 'kind of blue'}"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-8",
    "t": "User Albums",
    "orig": "User Albums",
    "lvl": 3,
    "tr": "Start with your program from Exercise 8-7. Write a while loop that allows users to enter an album's artist and title. Once you have that information, call make_album() with the user's input and print the dictionary that's created. Be sure to include a quit value that allows the user to exit the while loop.",
    "steps": [
     {
      "f": "Start from the {{make_album}} function.",
      "k": {
       "make_album": [
        "Same function as in 8-7.",
        "def make_album(artist, album_title, songs=None):\n    album = {\"artist\": artist, \"album_title\": album_title}\n    if songs:\n        album[\"songs\"] = songs\n    return album"
       ]
      },
      "c": "def make_album(artist, album_title, songs=None):\n    album = {\"artist\": artist, \"album_title\": album_title}\n    if songs:\n        album[\"songs\"] = songs\n    return album",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*None\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*\\{\\s*[\"\\']artist[\"\\']\\s*:\\s*.+,\\s*[\"\\']album_title[\"\\']\\s*:\\s*.+\\s*\\}$",
       "^if\\s+\\w+:$",
       "^\\w+\\[\\s*[\"\\']songs[\"\\']\\s*\\]\\s*=\\s*\\w+$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "{{while}} loop with input and a break on 'quit'.",
      "k": {
       "while": [
        "Inside the loop: read the artist and the album title, call make_album, print. If the user types 'quit' as the artist, exit.",
        "while True:\n    artist = input(\"Artist ('quit' to exit): \")\n    if artist == 'quit':\n        break\n    album_title = input(\"Album title: \")\n    print(make_album(artist, album_title))"
       ]
      },
      "c": "while True:\n    artist = input(\"Artist ('quit' to exit): \")\n    if artist == \"quit\":\n        break\n    album_title = input(\"Album title: \")\n    print(make_album(artist, album_title))",
      "re": [
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*\\)$"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-9",
    "t": "Messages",
    "orig": "Messages",
    "lvl": 2,
    "tr": "Make a list containing a series of short text messages. Pass the list to a function called <code>show_messages()</code>, which should print each text message.",
    "steps": [
     {
      "f": "Create the {{messages}} list.",
      "k": {
       "messages": [
        "A list of 3 short strings.",
        "messages = [\"Hello!\", \"How are you?\", \"See you later\"]"
       ]
      },
      "c": "messages = [\"Hello!\", \"How are you?\", \"See you later\"]",
      "re": "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$"
     },
     {
      "f": "Define the function that {{prints}} each message.",
      "k": {
       "prints": [
        "The function receives a list as a parameter. Inside, a for loop goes through the elements.",
        "def show_messages(message_list):\n    for message in message_list:\n        print(message)"
       ]
      },
      "c": "def show_messages(message_list):\n    for message in message_list:\n        print(message)",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Call the {{function}}, passing in the list.",
      "k": {
       "function": [
        "The call passes the list as an argument.",
        "show_messages(messages)"
       ]
      },
      "c": "show_messages(messages)",
      "re": "^\\w+\\(\\s*\\w+\\s*\\)\\s*$",
      "so": [
       "Hello!",
       "How are you?",
       "See you later"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-10",
    "t": "Sending Messages",
    "orig": "Sending Messages",
    "lvl": 3,
    "tr": "Start with your program from Exercise 8-9. Write a function called <code>send_messages()</code> that prints each text message and moves each message to a new list called <code>sent_messages</code> as it's printed. After calling the function, print both of your lists to make sure the messages were moved correctly.",
    "steps": [
     {
      "f": "Create the lists {{messages}} and {{sent_messages}}.",
      "k": {
       "messages": [
        "The starting list.",
        "messages = [\"Hello!\", \"How are you?\", \"See you later\"]"
       ],
       "sent_messages": [
        "The destination list (empty).",
        "sent_messages = []"
       ]
      },
      "c": "messages = [\"Hello!\", \"How are you?\", \"See you later\"]\nsent_messages = []",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\]$"
      ]
     },
     {
      "f": "Define the function with {{two parameters}}.",
      "k": {
       "two parameters": [
        "The function receives the source list and the destination list. Inside: a while loop that moves the messages with pop/append.",
        "def send_messages(unsent, sent):\n    while unsent:\n        m = unsent.pop(0)\n        print(f\"Sending: {m}\")\n        sent.append(m)"
       ]
      },
      "c": "def send_messages(unsent, sent):\n    while unsent:\n        m = unsent.pop(0)\n        print(f\"Sending: {m}\")\n        sent.append(m)",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^while\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.pop\\(\\s*0\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^\\w+\\.append\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Call the function and {{print}} both lists.",
      "k": {
       "print": [
        "The call plus two verification prints: the first list should be empty, the second one full.",
        "send_messages(messages, sent_messages)\nprint(f\"Original: {messages}\")\nprint(f\"Sent: {sent_messages}\")"
       ]
      },
      "c": "send_messages(messages, sent_messages)\nprint(f\"Original: {messages}\")\nprint(f\"Sent: {sent_messages}\")",
      "re": [
       "^\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Sending: Hello!",
       "Sending: How are you?",
       "Sending: See you later",
       "Original: []",
       "Sent: ['Hello!', 'How are you?', 'See you later']"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-11",
    "t": "Archived Messages",
    "orig": "Archived Messages",
    "lvl": 2,
    "tr": "Start with your program from Exercise 8-10. Call send_messages() with a <b>copy</b> of the list of messages. After calling the function, print both of your lists to show that the original list has retained its messages.",
    "steps": [
     {
      "f": "Start from 8-10 and add the {{copy}}.",
      "k": {
       "copy": [
        "The full slice <code>[:]</code> creates a copy: the function will empty out the copy, not the original.",
        "messages = [\"Hello!\", \"How are you?\", \"See you later\"]\nsent_messages = []\nsend_messages(messages[:], sent_messages)"
       ]
      },
      "c": "messages = [\"Hello!\", \"How are you?\", \"See you later\"]\nsent_messages = []\nsend_messages(messages[:], sent_messages)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\]$",
       "^\\w+\\(\\s*\\w+\\[\\s*:\\s*\\]\\s*,\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Print both lists to {{verify}}.",
      "k": {
       "verify": [
        "The original list should still be full, and the sent list full as well.",
        "print(f\"Original: {messages}\")\nprint(f\"Sent: {sent_messages}\")"
       ]
      },
      "c": "print(f\"Original: {messages}\")\nprint(f\"Sent: {sent_messages}\")",
      "re": [
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Original: ['Hello!', 'How are you?', 'See you later']",
       "Sent: ['Hello!', 'How are you?', 'See you later']"
      ]
     }
    ],
    "prereq": "8-10",
    "ch": 8
   },
   {
    "id": "8-12",
    "t": "Sandwiches",
    "orig": "Sandwiches",
    "lvl": 3,
    "tr": "Write a function that accepts a list of ingredients a person wants on a sandwich. The function should have one parameter that collects as many ingredients as the function call provides, and it should print a summary of the sandwich that's being ordered. Call the function three times, using a different number of arguments each time.",
    "steps": [
     {
      "f": "Define the function with {{*ingredients}}.",
      "k": {
       "*ingredients": [
        "The asterisk collects an arbitrary number of arguments into a <b>tuple</b>. Inside the function you can iterate over it as usual.",
        "def make_sandwich(*ingredients):\n    print(\"Making a sandwich with:\")\n    for ingredient in ingredients:\n        print(f\"  - {ingredient}\")"
       ]
      },
      "c": "def make_sandwich(*ingredients):\n    print(\"Making a sandwich with:\")\n    for ingredient in ingredients:\n        print(f\"  - {ingredient}\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\*\\w+\\s*\\)\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call it three times with {{different numbers}} of ingredients.",
      "k": {
       "different numbers": [
        "One call with 1 ingredient, one with 3, one with 5.",
        "make_sandwich(\"ham\")\nmake_sandwich(\"tuna\", \"mayo\", \"corn\")\nmake_sandwich(\"ham\", \"cheese\", \"tomato\", \"lettuce\", \"oregano\")"
       ]
      },
      "c": "make_sandwich(\"ham\")\nmake_sandwich(\"tuna\", \"mayo\", \"corn\")\nmake_sandwich(\"ham\", \"cheese\", \"tomato\", \"lettuce\", \"oregano\")",
      "re": [
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*){4}\\)$"
      ],
      "so": [
       "Making a sandwich with:",
       "  - ham",
       "Making a sandwich with:",
       "  - tuna",
       "  - mayo",
       "  - corn"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-13",
    "t": "User Profile",
    "orig": "User Profile",
    "lvl": 3,
    "tr": "Start with a copy of <code>user_profile.py</code>. Build a profile of yourself by calling <code>build_profile()</code>, using your first and last names and three other key-value pairs that describe you.",
    "steps": [
     {
      "f": "Define build_profile with {{**user_info}}.",
      "k": {
       "**user_info": [
        "The double asterisk collects an arbitrary number of <b>keyword arguments</b> into a dictionary.",
        "def build_profile(first, last, **user_info):\n    profile = {}\n    profile[\"first_name\"] = first\n    profile[\"last_name\"] = last\n    for k, v in user_info.items():\n        profile[k] = v\n    return profile"
       ]
      },
      "c": "def build_profile(first, last, **user_info):\n    profile = {}\n    profile[\"first_name\"] = first\n    profile[\"last_name\"] = last\n    for k, v in user_info.items():\n        profile[k] = v\n    return profile",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\*\\*\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*\\{\\s*\\}$",
       "^\\w+\\[\\s*[\"\\']first_name[\"\\']\\s*\\]\\s*=\\s*\\w+$",
       "^\\w+\\[\\s*[\"\\']last_name[\"\\']\\s*\\]\\s*=\\s*\\w+$",
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^\\w+\\[\\s*\\w+\\s*\\]\\s*=\\s*\\w+$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "Call it with a first name, a last name, and {{three}} keywords.",
      "k": {
       "three": [
        "The three extra pairs become keys in the dictionary.",
        "print(build_profile(\"maria\", \"rossi\", age=30, city=\"rome\", job=\"teacher\"))"
       ]
      },
      "c": "print(build_profile(\"maria\", \"rossi\", age=30, city=\"rome\", job=\"teacher\"))",
      "re": "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*=\\s*.+\\s*\\)\\s*\\)$"
     }
    ],
    "ch": 8
   },
   {
    "id": "8-14",
    "t": "Cars",
    "orig": "Cars",
    "lvl": 3,
    "tr": "Write a function that stores information about a car in a dictionary. The function should always receive the manufacturer and a model name. It should then accept an arbitrary number of keyword arguments. Call the function with the required information and two other name-value pairs, such as a color or an optional feature.",
    "steps": [
     {
      "f": "Define {{make_car}} with two fixed parameters and **options.",
      "k": {
       "make_car": [
        "Manufacturer and model are required (positional). Everything else goes into **options.",
        "def make_car(manufacturer, model, **options):\n    car_dict = {\"manufacturer\": manufacturer, \"model\": model}\n    for k, v in options.items():\n        car_dict[k] = v\n    return car_dict"
       ]
      },
      "c": "def make_car(manufacturer, model, **options):\n    car_dict = {\"manufacturer\": manufacturer, \"model\": model}\n    for k, v in options.items():\n        car_dict[k] = v\n    return car_dict",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\*\\*\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*\\{\\s*[\"\\']manufacturer[\"\\']\\s*:\\s*.+,\\s*[\"\\']model[\"\\']\\s*:\\s*.+\\s*\\}$",
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^\\w+\\[\\s*\\w+\\s*\\]\\s*=\\s*\\w+$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "Call it as in the book's example and {{print}} it.",
      "k": {
       "print": [
        "<code>make_car('subaru', 'outback', color='blue', tow_package=True)</code>.",
        "car = make_car(\"subaru\", \"outback\", color=\"blue\", tow_package=True)\nprint(car)"
       ]
      },
      "c": "car = make_car(\"subaru\", \"outback\", color=\"blue\", tow_package=True)\nprint(car)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*=\\s*.+\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ],
      "so": [
       "{'manufacturer': 'subaru', 'model': 'outback', 'color': 'blue', 'tow_package': True}"
      ]
     }
    ],
    "ch": 8
   },
   {
    "id": "8-15",
    "t": "Printing Models",
    "orig": "Printing Models",
    "lvl": 3,
    "tr": "The file <code>printing_functions.py</code> containing the two functions is already available. Write a program that imports the functions and uses them on a list of designs.",
    "steps": [
     {
      "f": "Import the functions from the {{printing_functions}} module.",
      "k": {
       "printing_functions": [
        "The module is preloaded. Import both functions.",
        "from printing_functions import print_models, show_completed"
       ]
      },
      "c": "from printing_functions import print_models, show_completed",
      "re": "^from\\s+\\w+\\s+import\\s+\\w+\\s*,\\s*\\w+\\s*$"
     },
     {
      "f": "Create the lists {{unprinted_designs}} and {{completed_models}}.",
      "k": {
       "unprinted_designs": [
        "Designs to print.",
        "unprinted_designs = [\"phone case\", \"robot pendant\"]"
       ],
       "completed_models": [
        "An empty list.",
        "completed_models = []"
       ]
      },
      "c": "unprinted_designs = [\"phone case\", \"robot pendant\"]\ncompleted_models = []",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*(,\\s*[\"'].+[\"']\\s*)+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\]$"
      ]
     },
     {
      "f": "Call the two functions to {{print}} and summarize.",
      "k": {
       "print": [
        "First print_models, then show_completed.",
        "print_models(unprinted_designs, completed_models)\nshow_completed(completed_models)"
       ]
      },
      "c": "print_models(unprinted_designs, completed_models)\nshow_completed(completed_models)",
      "re": [
       "^\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^\\w+\\(\\s*\\w+\\s*\\)$"
      ]
     }
    ],
    "virtualFiles": {
     "printing_functions.py": "def print_models(unprinted_designs, completed_models):\n    \"\"\"Simulate printing by moving the models from unprinted_designs to completed_models.\"\"\"\n    while unprinted_designs:\n        m = unprinted_designs.pop()\n        print(f\"Printing: {m}\")\n        completed_models.append(m)\n\ndef show_completed(completed_models):\n    \"\"\"Show the models that were printed.\"\"\"\n    print(\"Printed models:\")\n    for m in completed_models:\n        print(f\"  - {m}\")\n"
    },
    "ch": 8
   },
   {
    "id": "8-16",
    "t": "Imports",
    "orig": "Imports",
    "lvl": 3,
    "tr": "The module <code>my_module.py</code> is already available in the runtime and contains the function <code>greet(name)</code>. <b>Don't rewrite the function</b>: import it and call it. You can use any of Python's 5 import styles: <code>import my_module</code>, <code>from my_module import greet</code>, <code>from my_module import greet as s</code>, <code>import my_module as mm</code>, <code>from my_module import *</code>.",
    "steps": [
     {
      "f": "Write <b>two lines</b>: the first imports the module (in any style you choose), the second prints the result of <code>greet(\"ada\")</code>.",
      "k": {
       "two lines": [
        "Line 1: just the import. Line 2: a print that calls the function. Below you can see the simplest form (importing the whole module).",
        "import my_module\nprint(my_module.greet(\"ada\"))"
       ]
      },
      "c": "import my_module\nprint(my_module.greet(\"ada\"))",
      "re": [
       [
        "^import\\s+my_module\\s*$",
        "^print\\s*\\(\\s*my_module\\.greet\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
       ],
       [
        "^from\\s+my_module\\s+import\\s+greet\\s*$",
        "^print\\s*\\(\\s*greet\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
       ],
       [
        "^from\\s+my_module\\s+import\\s+greet\\s+as\\s+(\\w+)\\s*$",
        "^print\\s*\\(\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
       ],
       [
        "^import\\s+my_module\\s+as\\s+(\\w+)\\s*$",
        "^print\\s*\\(\\s*\\w+\\.greet\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
       ],
       [
        "^from\\s+my_module\\s+import\\s+\\*\\s*$",
        "^print\\s*\\(\\s*greet\\(\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
       ]
      ]
     }
    ],
    "virtualFiles": {
     "my_module.py": "def greet(name):\n    return f\"Hello {name.title()}!\"\n"
    },
    "ch": 8
   },
   {
    "id": "8-17",
    "t": "Styling Functions",
    "orig": "Styling Functions",
    "lvl": 1,
    "tr": "Choose any three programs you wrote in this chapter, and make sure they follow the styling guidelines described in this section: descriptive names, docstrings, spaces around = in defaults, lines ≤ 79 characters, and two blank lines between functions.",
    "steps": [
     {
      "f": "Check the {{names}} and docstrings in one of your programs.",
      "k": {
       "names": [
        "Function names should be lowercase, with underscores. Every function should have a docstring right after the def.",
        "def calculate_area(base, height):\n    \"\"\"Return the area of the rectangle.\"\"\"\n    …"
       ]
      },
      "c": null,
      "btn": "✓ Rule applied"
     },
     {
      "f": "Check {{spaces}} and line length.",
      "k": {
       "spaces": [
        "In defaults you do NOT put spaces around =: <code>def f(x, y=10):</code>. In keyword calls you do: <code>f(y=10)</code>.",
        "def my_function(param_0, param_1=\"default\"):"
       ]
      },
      "c": null,
      "btn": "✓ Rule applied"
     }
    ],
    "ch": 8
   }
  ]
 },
 {
  "n": 9,
  "t": "Classes",
  "sub": "Object-oriented programming: modeling the world with classes and instances",
  "concepts": [
   "class and the __init__ method",
   "Instance attributes and self",
   "Instance methods and dot notation",
   "Inheritance and super()",
   "Overriding methods",
   "Composition: instances as attributes",
   "Importing classes from modules",
   "The random module from the standard library",
   "Class naming style (CamelCase)"
  ],
  "ex": [
   {
    "id": "9-1",
    "t": "Restaurant",
    "orig": "Restaurant",
    "lvl": 2,
    "tr": "Make a class called <code>Restaurant</code>. The <code>__init__()</code> method should store two attributes: <code>restaurant_name</code> and <code>cuisine_type</code>. Make a method called <code>describe_restaurant()</code> that prints these two pieces of information, and a method called <code>open_restaurant()</code> that prints a message indicating that the restaurant is open. Make an instance called <code>restaurant</code> from the class. Print the two attributes individually, then call both methods.",
    "steps": [
     {
      "f": "Define the class with the {{class}} keyword and the __init__ method.",
      "k": {
       "class": [
        "Class names use CamelCase. <code>__init__</code> has two underscores before and two after. The first parameter is always self.",
        "class Restaurant:\n    def __init__(self, restaurant_name, cuisine_type):\n        self.restaurant_name = restaurant_name\n        self.cuisine_type = cuisine_type"
       ]
      },
      "c": "class Restaurant:\n    def __init__(self, restaurant_name, cuisine_type):\n        self.restaurant_name = restaurant_name\n        self.cuisine_type = cuisine_type",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$"
      ]
     },
     {
      "f": "Add the two {{methods}} (describe and open).",
      "k": {
       "methods": [
        "Every method takes self. Inside, you access the attributes with self.…",
        "    def describe_restaurant(self):\n        print(f\"{self.restaurant_name} serves {self.cuisine_type} cuisine.\")\n\n    def open_restaurant(self):\n        print(f\"{self.restaurant_name} is open!\")"
       ]
      },
      "c": "    def describe_restaurant(self):\n        print(f\"{self.restaurant_name} serves {self.cuisine_type} cuisine.\")\n\n    def open_restaurant(self):\n        print(f\"{self.restaurant_name} is open!\")",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{self\\.\\w+\\}.*\\{self\\.\\w+\\}.*[\"']\\s*\\)$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{self\\.\\w+\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Create the {{instance}}, then access the attributes and call the methods.",
      "k": {
       "instance": [
        "<code>restaurant = Restaurant(\"Da Mario\", \"Italian\")</code>. Then access the attributes (dot notation) and call the methods.",
        "restaurant = Restaurant(\"Da Mario\", \"Italian\")\nprint(restaurant.restaurant_name)\nprint(restaurant.cuisine_type)\nrestaurant.describe_restaurant()\nrestaurant.open_restaurant()"
       ]
      },
      "c": "restaurant = Restaurant(\"Da Mario\", \"Italian\")\nprint(restaurant.restaurant_name)\nprint(restaurant.cuisine_type)\nrestaurant.describe_restaurant()\nrestaurant.open_restaurant()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ],
      "so": [
       "Da Mario",
       "Italian",
       "Da Mario serves Italian cuisine.",
       "Da Mario is open!"
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-2",
    "t": "Three Restaurants",
    "orig": "Three Restaurants",
    "lvl": 1,
    "tr": "Start with the class from Exercise 9-1. Make three different instances from the class, and call describe_restaurant() for each one.",
    "steps": [
     {
      "f": "Start again from the {{Restaurant}} class from 9-1.",
      "k": {
       "Restaurant": [
        "Same class, unchanged.",
        "class Restaurant:\n    def __init__(self, restaurant_name, cuisine_type):\n        self.restaurant_name = restaurant_name\n        self.cuisine_type = cuisine_type\n    def describe_restaurant(self):\n        print(f\"{self.restaurant_name} serves {self.cuisine_type} cuisine.\")"
       ]
      },
      "c": "class Restaurant:\n    def __init__(self, restaurant_name, cuisine_type):\n        self.restaurant_name = restaurant_name\n        self.cuisine_type = cuisine_type\n    def describe_restaurant(self):\n        print(f\"{self.restaurant_name} serves {self.cuisine_type} cuisine.\")",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{self\\.\\w+\\}.*\\{self\\.\\w+\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Create three {{instances}} and call the method for each one.",
      "k": {
       "instances": [
        "Three different variables, three different calls.",
        "r1 = Restaurant(\"Da Mario\", \"Italian\")\nr2 = Restaurant(\"Sakura\", \"Japanese\")\nr3 = Restaurant(\"Taco Loco\", \"Mexican\")\nr1.describe_restaurant()\nr2.describe_restaurant()\nr3.describe_restaurant()"
       ]
      },
      "c": "r1 = Restaurant(\"Da Mario\", \"Italian\")\nr2 = Restaurant(\"Sakura\", \"Japanese\")\nr3 = Restaurant(\"Taco Loco\", \"Mexican\")\nr1.describe_restaurant()\nr2.describe_restaurant()\nr3.describe_restaurant()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ],
      "so": [
       "Da Mario serves Italian cuisine.",
       "Sakura serves Japanese cuisine.",
       "Taco Loco serves Mexican cuisine."
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-3",
    "t": "Users",
    "orig": "Users",
    "lvl": 3,
    "tr": "Make a class called <code>User</code>. Create two attributes called <code>first_name</code> and <code>last_name</code>, and then other attributes that are typically stored in a user profile. Make a method called <code>describe_user()</code> that prints a summary of the user's information. Make another method called <code>greet_user()</code> that prints a personalized greeting. Make several instances representing different users, and call both methods for each user.",
    "steps": [
     {
      "f": "Define the class with {{three}} attributes and the two methods.",
      "k": {
       "three": [
        "Besides first_name and last_name, add age, city, and so on.",
        "class User:\n    def __init__(self, first_name, last_name, age, city):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.age = age\n        self.city = city\n    def describe_user(self):\n        print(f\"{self.first_name} {self.last_name}, {self.age} years old, {self.city}\")\n    def greet_user(self):\n        print(f\"Hello {self.first_name.title()}!\")"
       ]
      },
      "c": "class User:\n    def __init__(self, first_name, last_name, age, city):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.age = age\n        self.city = city\n    def describe_user(self):\n        print(f\"{self.first_name} {self.last_name}, {self.age} years old, {self.city}\")\n    def greet_user(self):\n        print(f\"Hello {self.first_name.title()}!\")",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"\\'].*\\{self\\.\\w+\\}.*\\{self\\.\\w+\\}.*[\"\\']\\s*\\)$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"\\'].*\\{self\\.\\w+(\\.\\w+\\(\\))*\\}.*[\"\\']\\s*\\)$"
      ]
     },
     {
      "f": "Create two {{users}} and call both methods for each one.",
      "k": {
       "users": [
        "Two different instances, four calls in total.",
        "u1 = User(\"maria\", \"rossi\", 30, \"rome\")\nu2 = User(\"luca\", \"bianchi\", 45, \"milan\")\nu1.describe_user()\nu1.greet_user()\nu2.describe_user()\nu2.greet_user()"
       ]
      },
      "c": "u1 = User(\"maria\", \"rossi\", 30, \"rome\")\nu2 = User(\"luca\", \"bianchi\", 45, \"milan\")\nu1.describe_user()\nu1.greet_user()\nu2.describe_user()\nu2.greet_user()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ],
      "so": [
       "maria rossi, 30 years old, rome",
       "Hello Maria!",
       "luca bianchi, 45 years old, milan",
       "Hello Luca!"
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-4",
    "t": "Number Served",
    "orig": "Number Served",
    "lvl": 2,
    "tr": "Start with your program from Exercise 9-1. Add an attribute called <code>number_served</code> with a default value of 0. Create an instance called <code>restaurant</code> from the class. Print the number of customers served, then change the value and print it again. Add a method called <code>set_number_served()</code> that lets you set the number of customers that have been served. Add a method called <code>increment_number_served()</code> that increments the number of customers served.",
    "steps": [
     {
      "f": "Add the {{number_served}} attribute and the two methods.",
      "k": {
       "number_served": [
        "In the __init__: <code>self.number_served = 0</code>. Then the <code>set_number_served</code> and <code>increment_number_served</code> methods.",
        "class Restaurant:\n    def __init__(self, name, cuisine):\n        self.name = name\n        self.cuisine = cuisine\n        self.number_served = 0\n    def set_number_served(self, n):\n        self.number_served = n\n    def increment_number_served(self, n):\n        self.number_served += n"
       ]
      },
      "c": "class Restaurant:\n    def __init__(self, name, cuisine):\n        self.name = name\n        self.cuisine = cuisine\n        self.number_served = 0\n    def set_number_served(self, n):\n        self.number_served = n\n    def increment_number_served(self, n):\n        self.number_served += n",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*0\\s*$",
       "^def\\s+\\w+\\(\\s*self\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*\\+=\\s*\\w+$"
      ]
     },
     {
      "f": "Test with an {{instance}} and a few calls.",
      "k": {
       "instance": [
        "Create the restaurant, print, change the value, increment, print again.",
        "r = Restaurant(\"Da Mario\", \"Italian\")\nprint(r.number_served)\nr.set_number_served(50)\nprint(r.number_served)\nr.increment_number_served(20)\nprint(r.number_served)"
       ]
      },
      "c": "r = Restaurant(\"Da Mario\", \"Italian\")\nprint(r.number_served)\nr.set_number_served(50)\nprint(r.number_served)\nr.increment_number_served(20)\nprint(r.number_served)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\d+\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\d+\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$"
      ],
      "so": [
       "0",
       "50",
       "70"
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-5",
    "t": "Login Attempts",
    "orig": "Login Attempts",
    "lvl": 2,
    "tr": "Add an attribute called <code>login_attempts</code> to the User class from Exercise 9-3. Write a method called <code>increment_login_attempts()</code> that increments the value by 1. Write another method called <code>reset_login_attempts()</code> that resets the value to 0. Make an instance and call increment_login_attempts() several times. Print the value, then call reset_login_attempts() and print it again.",
    "steps": [
     {
      "f": "Add the attribute and the two methods to the {{User}} class.",
      "k": {
       "User": [
        "<code>self.login_attempts = 0</code> in the __init__. The two methods act accordingly.",
        "class User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.login_attempts = 0\n    def increment_login_attempts(self):\n        self.login_attempts += 1\n    def reset_login_attempts(self):\n        self.login_attempts = 0"
       ]
      },
      "c": "class User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.login_attempts = 0\n    def increment_login_attempts(self):\n        self.login_attempts += 1\n    def reset_login_attempts(self):\n        self.login_attempts = 0",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*0\\s*$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*\\+=\\s*1$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*0\\s*$"
      ]
     },
     {
      "f": "Call {{increment}} 3 times, print, reset, and print again.",
      "k": {
       "increment": [
        "Check that the increment works.",
        "u = User(\"maria\", \"rossi\")\nu.increment_login_attempts()\nu.increment_login_attempts()\nu.increment_login_attempts()\nprint(u.login_attempts)\nu.reset_login_attempts()\nprint(u.login_attempts)"
       ]
      },
      "c": "u = User(\"maria\", \"rossi\")\nu.increment_login_attempts()\nu.increment_login_attempts()\nu.increment_login_attempts()\nprint(u.login_attempts)\nu.reset_login_attempts()\nprint(u.login_attempts)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$"
      ],
      "so": [
       "3",
       "0"
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-6",
    "t": "Ice Cream Stand",
    "orig": "Ice Cream Stand",
    "lvl": 3,
    "tr": "An ice cream stand is a specific kind of restaurant. Write a class called <code>IceCreamStand</code> that inherits from the <code>Restaurant</code> class. Add an attribute called <code>flavors</code> that stores a list of ice cream flavors. Write a method that displays these flavors. Make an instance, and call the method.",
    "steps": [
     {
      "f": "Define {{IceCreamStand}} so it inherits from Restaurant.",
      "k": {
       "IceCreamStand": [
        "<code>class IceCreamStand(Restaurant):</code>. In the __init__ call <code>super().__init__(...)</code>, then add the specific attributes.",
        "class IceCreamStand(Restaurant):\n    def __init__(self, name, cuisine):\n        super().__init__(name, cuisine)\n        self.flavors = [\"vanilla\", \"chocolate\", \"pistachio\"]\n    def show_flavors(self):\n        print(\"Available flavors:\")\n        for f in self.flavors:\n            print(f\"  - {f}\")"
       ]
      },
      "c": "class IceCreamStand(Restaurant):\n    def __init__(self, name, cuisine):\n        super().__init__(name, cuisine)\n        self.flavors = [\"vanilla\", \"chocolate\", \"pistachio\"]\n    def show_flavors(self):\n        print(\"Available flavors:\")\n        for f in self.flavors:\n            print(f\"  - {f}\")",
      "re": [
       "^class\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^super\\(\\)\\.__init__\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*\\[.+,.+\\]$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+self\\.\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Create an {{instance}} and show the flavors.",
      "k": {
       "instance": [
        "Call the inherited method (describe_restaurant) and the new one (show_flavors).",
        "g = IceCreamStand(\"Gelateria Paradiso\", \"ice cream\")\ng.describe_restaurant()\ng.show_flavors()"
       ]
      },
      "c": "g = IceCreamStand(\"Gelateria Paradiso\", \"ice cream\")\ng.describe_restaurant()\ng.show_flavors()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "prereq": "9-1",
    "ch": 9
   },
   {
    "id": "9-7",
    "t": "Admin",
    "orig": "Admin",
    "lvl": 3,
    "tr": "An administrator is a special kind of user. Write a class called <code>Admin</code> that inherits from the <code>User</code> class from Exercise 9-3 or 9-5. Add an attribute called <code>privileges</code> that stores a list of strings like <code>\"can add post\"</code>, <code>\"can delete post\"</code>, <code>\"can ban user\"</code>. Write a method called <code>show_privileges()</code> that lists the administrator's privileges. Make an instance, and call the method.",
    "steps": [
     {
      "f": "Define {{Admin}} with inheritance and a privileges attribute.",
      "k": {
       "Admin": [
        "<code>class Admin(User):</code>. In the __init__, call super().__init__(first_name, last_name) and add <code>self.privileges</code>.",
        "class Admin(User):\n    def __init__(self, first_name, last_name, age, city):\n        super().__init__(first_name, last_name, age, city)\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        print(\"Privileges:\")\n        for p in self.privileges:\n            print(f\"  - {p}\")"
       ]
      },
      "c": "class Admin(User):\n    def __init__(self, first_name, last_name, age, city):\n        super().__init__(first_name, last_name, age, city)\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        print(\"Privileges:\")\n        for p in self.privileges:\n            print(f\"  - {p}\")",
      "re": [
       "^class\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^super\\(\\)\\.__init__\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*\\[.+,.+\\]$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+self\\.\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Make an {{instance}} and show the privileges.",
      "k": {
       "instance": [
        "<code>a = Admin(\"maria\", \"rossi\", 30, \"Rome\")</code>: the same parameters as User.",
        "a = Admin(\"maria\", \"rossi\", 30, \"Rome\")\na.show_privileges()"
       ]
      },
      "c": "a = Admin(\"maria\", \"rossi\", 30, \"Rome\")\na.show_privileges()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"\\'].+[\"\\']\\s*,\\s*[\"\\'].+[\"\\']\\s*,\\s*\\d+\\s*,\\s*[\"\\'].+[\"\\']\\s*\\)$",
       "^\\w+(\\.\\w+)+\\(\\)\\s*$"
      ]
     }
    ],
    "prereq": "9-3",
    "ch": 9
   },
   {
    "id": "9-8",
    "t": "Privileges",
    "orig": "Privileges",
    "lvl": 3,
    "tr": "Write a separate <code>Privileges</code> class. The class should have an attribute called <code>privileges</code> that stores the list of strings from 9-7. Move the <code>show_privileges()</code> method into this class. Make a Privileges instance as an attribute in the Admin class. Make a new instance of Admin and use your method to show its privileges.",
    "steps": [
     {
      "f": "Define the {{Privileges}} class and update Admin.",
      "k": {
       "Privileges": [
        "The Privileges class has its own __init__ with the list and the show_privileges method. Admin creates <code>self.privileges = Privileges()</code>.",
        "class Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        print(\"Privileges:\")\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name, age, city):\n        super().__init__(first_name, last_name, age, city)\n        self.privileges = Privileges()"
       ]
      },
      "c": "class Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        print(\"Privileges:\")\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name, age, city):\n        super().__init__(first_name, last_name, age, city)\n        self.privileges = Privileges()",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\[.+,.+\\]$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+self\\.\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^class\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^super\\(\\)\\.__init__\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*\\w+\\(\\)$"
      ]
     },
     {
      "f": "Make an Admin and {{call}} the method through the attribute.",
      "k": {
       "call": [
        "Access is now <code>a.privileges.show_privileges()</code>: two levels of dot notation.",
        "a = Admin(\"maria\", \"rossi\", 30, \"Rome\")\na.privileges.show_privileges()"
       ]
      },
      "c": "a = Admin(\"maria\", \"rossi\", 30, \"Rome\")\na.privileges.show_privileges()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "prereq": "9-3",
    "ch": 9
   },
   {
    "id": "9-9",
    "t": "Battery Upgrade",
    "orig": "Battery Upgrade",
    "lvl": 3,
    "tr": "Use the final version of <code>electric_car.py</code>. Add a method to the <code>Battery</code> class called <code>upgrade_battery()</code>. The method should check the battery's size and set the capacity to 65 if it isn't already. Make an electric car, call <code>get_range()</code> once, then call it again after the upgrade: you should see the range increase.",
    "steps": [
     {
      "f": "The {{electric_car.py}} file is already available. Import the classes.",
      "k": {
       "electric_car.py": [
        "The module is preloaded in the runtime (it contains Car, Battery, and ElectricCar).",
        "from electric_car import Battery, ElectricCar"
       ]
      },
      "c": "from electric_car import Battery, ElectricCar",
      "re": "^from\\s+\\w+\\s+import\\s+\\w+\\s*,\\s*\\w+\\s*$"
     },
     {
      "f": "Add the {{upgrade_battery}} method to Battery.",
      "k": {
       "upgrade_battery": [
        "Define the function at module level, then attach it to the class with <code>Battery.upgrade_battery = upgrade_battery</code>.",
        "def upgrade_battery(self):\n    if self.battery_size != 65:\n        self.battery_size = 65\nBattery.upgrade_battery = upgrade_battery"
       ]
      },
      "c": "def upgrade_battery(self):\n    if self.battery_size != 65:\n        self.battery_size = 65\nBattery.upgrade_battery = upgrade_battery",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^if\\s+self\\.\\w+\\s*!=\\s*65\\s*:$",
       "^self\\.\\w+\\s*=\\s*65\\s*$",
       "^Battery\\.upgrade_battery\\s*=\\s*upgrade_battery$"
      ]
     },
     {
      "f": "Test {{before}} and after the upgrade.",
      "k": {
       "before": [
        "Call get_range() with the 40-kWh battery, then upgrade, then call get_range() again.",
        "car = ElectricCar(\"nissan\", \"leaf\", 2024)\ncar.battery.get_range()\ncar.battery.upgrade_battery()\ncar.battery.get_range()"
       ]
      },
      "c": "car = ElectricCar(\"nissan\", \"leaf\", 2024)\ncar.battery.get_range()\ncar.battery.upgrade_battery()\ncar.battery.get_range()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*\\)$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "virtualFiles": {
     "electric_car.py": "class Car:\n    def __init__(self, make, model, year):\n        self.make = make\n        self.model = model\n        self.year = year\n        self.odometer_reading = 0\n    def get_descriptive_name(self):\n        return f\"{self.year} {self.make} {self.model}\".title()\n    def read_odometer(self):\n        print(f\"This car has {self.odometer_reading} miles on it.\")\n    def update_odometer(self, mileage):\n        if mileage >= self.odometer_reading:\n            self.odometer_reading = mileage\n        else:\n            print(\"You can't roll back an odometer!\")\n    def increment_odometer(self, miles):\n        self.odometer_reading += miles\n\nclass Battery:\n    def __init__(self, battery_size=40):\n        self.battery_size = battery_size\n    def describe_battery(self):\n        print(f\"This vehicle has a {self.battery_size}-kWh battery.\")\n    def get_range(self):\n        if self.battery_size == 40:\n            r = 150\n        elif self.battery_size == 65:\n            r = 225\n        print(f\"This car can go about {r} miles on a full charge.\")\n\nclass ElectricCar(Car):\n    def __init__(self, make, model, year):\n        super().__init__(make, model, year)\n        self.battery = Battery()\n"
    },
    "ch": 9
   },
   {
    "id": "9-10",
    "t": "Imported Restaurant",
    "orig": "Imported Restaurant",
    "lvl": 2,
    "tr": "Use your Restaurant class. Store it in a module. Create a separate file that imports Restaurant. Make an instance of Restaurant and call one of its methods to show that the import works.",
    "steps": [
     {
      "f": "Create the {{restaurant.py}} module with the class.",
      "k": {
       "restaurant.py": [
        "The Restaurant class in a separate file.",
        "# restaurant.py\nclass Restaurant:\n    def __init__(self, name, cuisine):\n        self.name = name\n        self.cuisine = cuisine\n    def describe_restaurant(self):\n        print(f\"{self.name} serves {self.cuisine} cuisine.\")"
       ]
      },
      "c": "# restaurant.py\nclass Restaurant:\n    def __init__(self, name, cuisine):\n        self.name = name\n        self.cuisine = cuisine\n    def describe_restaurant(self):\n        print(f\"{self.name} serves {self.cuisine} cuisine.\")",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{self\\.\\w+\\}.*\\{self\\.\\w+\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Create the {{main}} file that imports and uses it.",
      "k": {
       "main": [
        "<code>from restaurant import Restaurant</code>. Make an instance, call a method.",
        "# main.py\nfrom restaurant import Restaurant\nr = Restaurant(\"Da Mario\", \"Italian\")\nr.describe_restaurant()"
       ]
      },
      "c": "# main.py\nfrom restaurant import Restaurant\nr = Restaurant(\"Da Mario\", \"Italian\")\nr.describe_restaurant()",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "files": [
     "restaurant.py",
     "main.py"
    ],
    "ch": 9
   },
   {
    "id": "9-11",
    "t": "Imported Admin",
    "orig": "Imported Admin",
    "lvl": 3,
    "tr": "Start with your work from Exercise 9-8. Store the User, Privileges, and Admin classes in a single module. Create a separate file, make an Admin instance, and call show_privileges() to check that everything works.",
    "steps": [
     {
      "f": "Create the {{admin_module.py}} module with the three classes.",
      "k": {
       "admin_module.py": [
        "One file with User, Privileges, and Admin.",
        "# admin_module.py\nclass User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name\n\nclass Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name):\n        super().__init__(first_name, last_name)\n        self.privileges = Privileges()"
       ]
      },
      "c": "# admin_module.py\nclass User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name\n\nclass Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\", \"can ban user\"]\n    def show_privileges(self):\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name):\n        super().__init__(first_name, last_name)\n        self.privileges = Privileges()",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\[.+,.+\\]$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^for\\s+\\w+\\s+in\\s+self\\.\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^class\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^super\\(\\)\\.__init__\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*\\w+\\(\\)$"
      ]
     },
     {
      "f": "Import into {{main}} and make an Admin.",
      "k": {
       "main": [
        "<code>from admin_module import Admin</code>. Make an Admin, call the method on the privileges.",
        "# main.py\nfrom admin_module import Admin\na = Admin(\"maria\", \"rossi\")\na.privileges.show_privileges()"
       ]
      },
      "c": "# main.py\nfrom admin_module import Admin\na = Admin(\"maria\", \"rossi\")\na.privileges.show_privileges()",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "files": [
     "admin_module.py",
     "main.py"
    ],
    "ch": 9
   },
   {
    "id": "9-12",
    "t": "Multiple Modules",
    "orig": "Multiple Modules",
    "lvl": 3,
    "tr": "Store the User class in one module, and the Privileges and Admin classes in another module. In a separate file, make an Admin instance and call show_privileges() to check that everything still works.",
    "steps": [
     {
      "f": "Create {{user.py}} with just the User class.",
      "k": {
       "user.py": [
        "User on its own.",
        "# user.py\nclass User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name"
       ]
      },
      "c": "# user.py\nclass User:\n    def __init__(self, first_name, last_name):\n        self.first_name = first_name\n        self.last_name = last_name",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$"
      ]
     },
     {
      "f": "Create {{admin.py}} with Privileges and Admin, importing User.",
      "k": {
       "admin.py": [
        "<code>from user import User</code> at the top. The other two classes use User as their base.",
        "# admin.py\nfrom user import User\n\nclass Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\"]\n    def show_privileges(self):\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name):\n        super().__init__(first_name, last_name)\n        self.privileges = Privileges()"
       ]
      },
      "c": "# admin.py\nfrom user import User\n\nclass Privileges:\n    def __init__(self):\n        self.privileges = [\"can add post\", \"can delete post\"]\n    def show_privileges(self):\n        for p in self.privileges:\n            print(f\"  - {p}\")\n\nclass Admin(User):\n    def __init__(self, first_name, last_name):\n        super().__init__(first_name, last_name)\n        self.privileges = Privileges()",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\[.+,.+\\]$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^for\\s+\\w+\\s+in\\s+self\\.\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^class\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^super\\(\\)\\.__init__\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*\\w+\\(\\)$"
      ]
     },
     {
      "f": "Create the {{main}} file that imports Admin.",
      "k": {
       "main": [
        "<code>from admin import Admin</code> (you don't need to import User directly; admin.py takes care of it).",
        "# main.py\nfrom admin import Admin\na = Admin(\"maria\", \"rossi\")\na.privileges.show_privileges()"
       ]
      },
      "c": "# main.py\nfrom admin import Admin\na = Admin(\"maria\", \"rossi\")\na.privileges.show_privileges()",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\.\\w+\\(\\)\\s*$"
      ]
     }
    ],
    "files": [
     "user.py",
     "admin.py",
     "main.py"
    ],
    "ch": 9
   },
   {
    "id": "9-13",
    "t": "Dice",
    "orig": "Dice",
    "lvl": 2,
    "tr": "Make a class called <code>Die</code> with one attribute called <code>sides</code>, which has a default value of 6. Write a method called <code>roll_die()</code> that prints a random number between 1 and the number of sides the die has. Make a 6-sided die and roll it 10 times. Make a 10-sided die and a 20-sided die. Roll each die 10 times.",
    "steps": [
     {
      "f": "Define the class with the {{roll_die}} method.",
      "k": {
       "roll_die": [
        "Import <code>randint</code> from random. The method returns (or prints) an integer in [1, sides].",
        "from random import randint\n\nclass Die:\n    def __init__(self, sides=6):\n        self.sides = sides\n    def roll_die(self):\n        print(randint(1, self.sides))"
       ]
      },
      "c": "from random import randint\n\nclass Die:\n    def __init__(self, sides=6):\n        self.sides = sides\n    def roll_die(self):\n        print(randint(1, self.sides))",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*=\\s*6\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^print\\s*\\(\\s*\\w+\\(\\s*1\\s*,\\s*self\\.\\w+\\s*\\)\\s*\\)$"
      ]
     },
     {
      "f": "Roll the three dice {{10 times}} each with a loop.",
      "k": {
       "10 times": [
        "A for loop of 10 iterations for each die.",
        "d6 = Die()\nfor _ in range(10):\n    d6.roll_die()"
       ]
      },
      "c": "d6 = Die()\nfor _ in range(10):\n    d6.roll_die()\nd10 = Die(10)\nfor _ in range(10):\n    d10.roll_die()\nd20 = Die(20)\nfor _ in range(10):\n    d20.roll_die()",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\s*10\\s*\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\d+\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\s*10\\s*\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\)\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\d+\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\s*10\\s*\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\)\\s*$"
      ],
      "note": "The output changes on every run (it's random). That's fine: it's exactly the point of the exercise."
     }
    ],
    "ch": 9
   },
   {
    "id": "9-14",
    "t": "Lottery",
    "orig": "Lottery",
    "lvl": 3,
    "tr": "Make a list or a tuple containing 10 numbers and 5 letters. Randomly select 4 numbers or letters, and print a message saying that any ticket matching these 4 numbers or letters wins a prize.",
    "steps": [
     {
      "f": "Create the {{tickets}} list with 10 numbers and 5 letters.",
      "k": {
       "tickets": [
        "15 elements in all: 10 integers, 5 strings.",
        "tickets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, \"a\", \"b\", \"c\", \"d\", \"e\"]"
       ]
      },
      "c": "tickets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, \"a\", \"b\", \"c\", \"d\", \"e\"]",
      "re": "^\\w+\\s*=\\s*\\[.+\\]$"
     },
     {
      "f": "Draw {{4 elements}} at random, without replacement.",
      "k": {
       "4 elements": [
        "<code>random.sample</code> draws without replacement. Import the module or the function.",
        "from random import sample\nwinning = sample(tickets, 4)\nprint(f\"Winning ticket: {winning}\")"
       ]
      },
      "c": "from random import sample\nwinning = sample(tickets, 4)\nprint(f\"Winning ticket: {winning}\")",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*,\\s*4\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 9
   },
   {
    "id": "9-15",
    "t": "Lottery Analysis",
    "orig": "Lottery Analysis",
    "lvl": 3,
    "tr": "You can use a loop to see how hard it is to win the lottery you just modeled. Make a list or tuple called <code>my_ticket</code>. Write a loop that keeps drawing numbers until your ticket wins. Print a message reporting how many times the loop had to run to give you a winning ticket.",
    "steps": [
     {
      "f": "Create {{my_ticket}} and the {{tickets}} list.",
      "k": {
       "my_ticket": [
        "Your fixed ticket (4 elements).",
        "my_ticket = [1, \"a\", 5, \"c\"]"
       ],
       "tickets": [
        "The same 15 elements as in 9-14.",
        "tickets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, \"a\", \"b\", \"c\", \"d\", \"e\"]"
       ]
      },
      "c": "my_ticket = [1, \"a\", 5, \"c\"]\ntickets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, \"a\", \"b\", \"c\", \"d\", \"e\"]",
      "re": [
       "^\\w+\\s*=\\s*\\[.+\\]$",
       "^\\w+\\s*=\\s*\\[.+\\]$"
      ]
     },
     {
      "f": "A {{while}} loop that keeps drawing until it matches.",
      "k": {
       "while": [
        "Draw on each pass, compare, increment the counter. Watch out: it may run thousands of times (or more).",
        "from random import sample\ncounter = 0\nwhile True:\n    counter += 1\n    drawn = sample(tickets, 4)\n    if drawn == my_ticket:\n        break\nprint(f\"It took {counter} attempts to win!\")"
       ]
      },
      "c": "from random import sample\ncounter = 0\nwhile True:\n    counter += 1\n    drawn = sample(tickets, 4)\n    if drawn == my_ticket:\n        break\nprint(f\"It took {counter} attempts to win!\")",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*0\\s*$",
       "^while\\s+True\\s*:$",
       "^\\w+\\s*\\+=\\s*1\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*,\\s*4\\s*\\)$",
       "^if\\s+\\w+\\s*==\\s*\\w+\\s*:$",
       "^break\\s*$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "note": "Watch out: this can take a while. Pyodide's watchdog will stop execution after 8 seconds if the loop doesn't finish. Reduce the number of tickets to make it faster."
     }
    ],
    "ch": 9
   },
   {
    "id": "9-16",
    "t": "Python Module of the Week",
    "orig": "Python Module of the Week",
    "lvl": 1,
    "tr": "An excellent resource for exploring the Python standard library is the site <i>Python Module of the Week</i>: <code>https://pymotw.com</code>. Take a look at the index, find a module that looks interesting to you, and read its description — perhaps starting with the <code>random</code> module.",
    "steps": [
     {
      "f": "Open {{pymotw.com}} and browse the index.",
      "k": {
       "pymotw.com": [
        "A site with articles about almost every module in the standard library.",
        "https://pymotw.com"
       ]
      },
      "c": null,
      "btn": "✓ Index browsed"
     },
     {
      "f": "Pick a {{module}} and read its page.",
      "k": {
       "module": [
        "E.g. random, pathlib, json, datetime, collections.",
        "e.g. \"random\""
       ]
      },
      "c": null,
      "ta": "Which module did you pick, and why? (min 15 characters)…",
      "min": 15
     }
    ],
    "ch": 9
   }
  ]
 },
 {
  "n": 10,
  "t": "Files and Exceptions",
  "sub": "Reading and writing files, handling errors with try-except, saving data with JSON",
  "concepts": [
   "Path and read_text/write_text",
   "Relative and absolute paths",
   "splitlines() and line-by-line iteration",
   "Exceptions: try, except, else, finally",
   "FileNotFoundError, ZeroDivisionError, ValueError",
   "The json module: dumps, loads",
   "Saving and reloading user data"
  ],
  "ex": [
   {
    "id": "10-1",
    "t": "Learning Python",
    "orig": "Learning Python",
    "lvl": 3,
    "tr": "Open a blank file in your editor and write a few lines that summarize what you've learned about Python so far. Start each line with the phrase <i>In Python you can…</i>. Save the file as <code>learning_python.txt</code> in the same directory as your exercises. Write a program that reads the file and prints what you wrote two times: once by reading the entire file, and once by loading the lines into a list and looping over each one.",
    "steps": [
     {
      "f": "Create the file {{learning_python.txt}} with three lines.",
      "k": {
       "learning_python.txt": [
        "In Pyodide the file must be created first. Use Path.write_text to write the content.",
        "from pathlib import Path\npath = Path(\"learning_python.txt\")\npath.write_text(\"In Python you can build web apps.\\nIn Python you can analyze data.\\nIn Python you can automate tasks.\\n\")"
       ]
      },
      "c": "from pathlib import Path\npath = Path(\"learning_python.txt\")\npath.write_text(\"In Python you can build web apps.\\nIn Python you can analyze data.\\nIn Python you can automate tasks.\\n\")",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$"
      ]
     },
     {
      "f": "First print: {{all at once}} the contents in one go.",
      "k": {
       "all at once": [
        "Read with read_text() and print. Optionally use rstrip() to remove the trailing newline.",
        "contents = path.read_text().rstrip()\nprint(\"=== All at once ===\")\nprint(contents)"
       ]
      },
      "c": "contents = path.read_text().rstrip()\nprint(\"=== All at once ===\")\nprint(contents)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)\\.\\w+\\(\\)$",
       "^print\\s*\\(.+\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Second print: {{line by line}} using splitlines and a loop.",
      "k": {
       "line by line": [
        "splitlines() returns a list of lines. Then a for loop.",
        "lines = contents.splitlines()\nprint(\"=== Line by line ===\")\nfor each_line in lines:\n    print(each_line)"
       ]
      },
      "c": "lines = contents.splitlines()\nprint(\"=== Line by line ===\")\nfor each_line in lines:\n    print(each_line)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)$",
       "^print\\s*\\(.+\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-2",
    "t": "Learning C",
    "orig": "Learning C",
    "lvl": 2,
    "tr": "Read each line of the file learning_python.txt and replace the word <i>Python</i> with the name of another language, for example C. Print each modified line.",
    "steps": [
     {
      "f": "Read the file again and {{replace}} Python with C.",
      "k": {
       "replace": [
        "The <code>replace(old, new)</code> method returns a new string with every occurrence replaced.",
        "from pathlib import Path\npath = Path(\"learning_python.txt\")\ncontents = path.read_text()"
       ]
      },
      "c": "from pathlib import Path\npath = Path(\"learning_python.txt\")\ncontents = path.read_text()",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)$"
      ]
     },
     {
      "f": "Loop over the lines and {{print}} the modified version.",
      "k": {
       "print": [
        "<code>each_line.replace(\"Python\", \"C\")</code> for each line.",
        "for each_line in contents.splitlines():\n    print(each_line.replace(\"Python\", \"C\"))"
       ]
      },
      "c": "for each_line in contents.splitlines():\n    print(each_line.replace(\"Python\", \"C\"))",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)\\s*\\)$"
      ]
     }
    ],
    "prereq": "10-1",
    "ch": 10
   },
   {
    "id": "10-3",
    "t": "Simpler Code",
    "orig": "Simpler Code",
    "lvl": 1,
    "tr": "The <code>file_reader.py</code> program uses a temporary variable <code>lines</code> to show how splitlines() works. You can skip it and loop directly over the list that splitlines() returns. Remove the temporary variable from each of the programs in this section to make them more concise.",
    "steps": [
     {
      "f": "Rewrite the {{program}} without the temporary variable.",
      "k": {
       "program": [
        "The loop <code>for line in contents.splitlines():</code> avoids the intermediate step.",
        "from pathlib import Path\npath = Path(\"learning_python.txt\")\ncontents = path.read_text()\nfor line in contents.splitlines():\n    print(line)"
       ]
      },
      "c": "from pathlib import Path\npath = Path(\"learning_python.txt\")\ncontents = path.read_text()\nfor line in contents.splitlines():\n    print(line)",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$"
      ]
     }
    ],
    "prereq": "10-1",
    "ch": 10
   },
   {
    "id": "10-4",
    "t": "Guest",
    "orig": "Guest",
    "lvl": 2,
    "tr": "Write a program that prompts the user for their name. When they respond, write it to a file called <code>guest.txt</code>.",
    "steps": [
     {
      "f": "Ask for the {{name}} and write it to guest.txt.",
      "k": {
       "name": [
        "Path.write_text writes a string. If the file doesn't exist, it creates it; if it does exist, it overwrites it.",
        "from pathlib import Path\nname = input(\"What is your name? \")\npath = Path(\"guest.txt\")\npath.write_text(name)"
       ]
      },
      "c": "from pathlib import Path\nname = input(\"What is your name? \")\npath = Path(\"guest.txt\")\npath.write_text(name)",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\s*\\)$"
      ],
      "note": "This works in Pyodide too: the file ends up at /home/pyodide/guest.txt."
     }
    ],
    "ch": 10
   },
   {
    "id": "10-5",
    "t": "Guest Book",
    "orig": "Guest Book",
    "lvl": 3,
    "tr": "Write a while loop that prompts the user for their name. Collect all the names that are entered and write them to a file called <code>guest_book.txt</code>. Make sure each name appears on a new line.",
    "steps": [
     {
      "f": "Use a {{while}} loop to collect the names.",
      "k": {
       "while": [
        "A loop that ends on 'quit'. Build up the names in a list, or build the text directly.",
        "names = []\nwhile True:\n    name = input(\"Name ('quit' to exit): \")\n    if name == \"quit\":\n        break\n    names.append(name)"
       ]
      },
      "c": "names = []\nwhile True:\n    name = input(\"Name ('quit' to exit): \")\n    if name == \"quit\":\n        break\n    names.append(name)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*\\]$",
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^\\w+\\.append\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Write the names {{to a file}}, one per line.",
      "k": {
       "to a file": [
        "<code>\"\\n\".join(names)</code> joins the names with newlines. Write them to guest_book.txt.",
        "from pathlib import Path\ncontents = \"\\n\".join(names)\nPath(\"guest_book.txt\").write_text(contents)"
       ]
      },
      "c": "from pathlib import Path\ncontents = \"\\n\".join(names)\nPath(\"guest_book.txt\").write_text(contents)",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\s*=\\s*[\"'].*[\"']\\.\\w+\\(\\s*\\w+\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\.\\w+\\(\\s*\\w+\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-6",
    "t": "Addition",
    "orig": "Addition",
    "lvl": 3,
    "tr": "One common problem when prompting for numerical input is that people provide text instead of numbers. When you try to convert the input to an int, you get a ValueError. Write a program that prompts for two numbers, adds them together, and prints the result. Catch the ValueError if either input is not a number, and print a friendly message.",
    "steps": [
     {
      "f": "Ask for the two numbers and try the {{sum}} in a try block.",
      "k": {
       "sum": [
        "<code>try: … except ValueError: …</code>. Only the lines that can raise the exception go in the try block.",
        "try:\n    a = int(input(\"First number: \"))\n    b = int(input(\"Second number: \"))\n    print(a + b)\nexcept ValueError:\n    print(\"You need to enter two numbers!\")"
       ]
      },
      "c": "try:\n    a = int(input(\"First number: \"))\n    b = int(input(\"Second number: \"))\n    print(a + b)\nexcept ValueError:\n    print(\"You need to enter two numbers!\")",
      "re": [
       "^try\\s*:$",
       "^\\w+\\s*=\\s*int\\(\\s*input\\(.+\\)\\s*\\)$",
       "^\\w+\\s*=\\s*int\\(\\s*input\\(.+\\)\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\+\\s*\\w+\\s*\\)$",
       "^except\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-7",
    "t": "Addition Calculator",
    "orig": "Addition Calculator",
    "lvl": 3,
    "tr": "Wrap your code from Exercise 10-6 in a while loop, so the user can keep entering numbers even if they make a mistake and enter text instead of a number.",
    "steps": [
     {
      "f": "Add an outer {{loop}} with break.",
      "k": {
       "loop": [
        "The try/except goes INSIDE the while. If the except block runs, the loop continues (the error is handled). If the user wants to quit, they can type 'quit' (but int() would fail — careful!).",
        "while True:\n    a_input = input(\"First number ('quit' to exit): \")\n    if a_input == \"quit\":\n        break\n    b_input = input(\"Second number ('quit' to exit): \")\n    if b_input == \"quit\":\n        break\n    try:\n        print(int(a_input) + int(b_input))\n    except ValueError:\n        print(\"Numbers, not text!\")"
       ]
      },
      "c": "while True:\n    a_input = input(\"First number ('quit' to exit): \")\n    if a_input == \"quit\":\n        break\n    b_input = input(\"Second number ('quit' to exit): \")\n    if b_input == \"quit\":\n        break\n    try:\n        print(int(a_input) + int(b_input))\n    except ValueError:\n        print(\"Numbers, not text!\")",
      "re": [
       "^while\\s+True\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^if\\s+\\w+\\s*==\\s*[\"']quit[\"']\\s*:$",
       "^break\\s*$",
       "^try\\s*:$",
       "^print\\s*\\(\\s*int\\(\\s*\\w+\\s*\\)\\s*\\+\\s*int\\(\\s*\\w+\\s*\\)\\s*\\)$",
       "^except\\s+\\w+\\s*:$",
       "^print\\s*\\(.+\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-8",
    "t": "Cats and Dogs",
    "orig": "Cats and Dogs",
    "lvl": 3,
    "tr": "Make two files, <code>cats.txt</code> and <code>dogs.txt</code>. Write at least three cat names in the first one and three dog names in the second. Write a program that tries to read these files and print their contents. Wrap the code in a try-except block to catch FileNotFoundError, and print a friendly message if a file is missing. Move one of the files to another location and make sure the except block works.",
    "steps": [
     {
      "f": "Create the two files {{cats.txt}} and {{dogs.txt}}.",
      "k": {
       "cats.txt": [
        "In Pyodide, write them with Path.write_text.",
        "from pathlib import Path\nPath(\"cats.txt\").write_text(\"whiskers\\nfluffy\\npatches\\n\")\nPath(\"dogs.txt\").write_text(\"rex\\nbalto\\nlola\\n\")"
       ]
      },
      "c": "from pathlib import Path\nPath(\"cats.txt\").write_text(\"whiskers\\nfluffy\\npatches\\n\")\nPath(\"dogs.txt\").write_text(\"rex\\nbalto\\nlola\\n\")",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Read {{both}} files with try/except.",
      "k": {
       "both": [
        "Two try/except blocks (or a loop over the file names). If a file is missing, print a message instead of the traceback.",
        "for filename in [\"cats.txt\", \"dogs.txt\"]:\n    try:\n        contents = Path(filename).read_text()\n        print(f\"\\n--- {filename} ---\")\n        print(contents)\n    except FileNotFoundError:\n        print(f\"The file {filename} does not exist.\")"
       ]
      },
      "c": "for filename in [\"cats.txt\", \"dogs.txt\"]:\n    try:\n        contents = Path(filename).read_text()\n        print(f\"\\n--- {filename} ---\")\n        print(contents)\n    except FileNotFoundError:\n        print(f\"The file {filename} does not exist.\")",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\[.+\\]\\s*:$",
       "^try\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*\\)\\.\\w+\\(\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$",
       "^except\\s+\\w+\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-9",
    "t": "Silent Cats and Dogs",
    "orig": "Silent Cats and Dogs",
    "lvl": 3,
    "tr": "Modify your except block from Exercise 10-8 so it fails silently if one of the files is missing.",
    "steps": [
     {
      "f": "Replace the message with {{pass}}.",
      "k": {
       "pass": [
        "<code>pass</code> is the statement that does nothing: if a file is missing, the program moves on without printing anything for that file.",
        "for filename in [\"cats.txt\", \"dogs.txt\"]:\n    try:\n        contents = Path(filename).read_text()\n        print(f\"\\n--- {filename} ---\")\n        print(contents)\n    except FileNotFoundError:\n        pass"
       ]
      },
      "c": "for filename in [\"cats.txt\", \"dogs.txt\"]:\n    try:\n        contents = Path(filename).read_text()\n        print(f\"\\n--- {filename} ---\")\n        print(contents)\n    except FileNotFoundError:\n        pass",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\[.+\\]\\s*:$",
       "^try\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*\\)\\.\\w+\\(\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*\\w+\\s*\\)$",
       "^except\\s+\\w+\\s*:$",
       "^pass\\s*$"
      ]
     }
    ],
    "prereq": "10-8",
    "ch": 10
   },
   {
    "id": "10-10",
    "t": "Common Words",
    "orig": "Common Words",
    "lvl": 3,
    "tr": "Visit Project Gutenberg and find a few texts you'd like to analyze. Download the files, or copy the raw text from the browser into a file. The <code>count()</code> method counts how many times a word or phrase appears in a string. Write a program that reads the files and determines how many times the word <i>'the'</i> appears in each text. Also try counting <i>'the '</i> with a space after it, and see how much lower the count is.",
    "steps": [
     {
      "f": "Create a {{text.txt}} file with some sample text.",
      "k": {
       "text.txt": [
        "You don't need Gutenberg for this exercise: a text with plenty of \"the\" is enough.",
        "from pathlib import Path\nPath(\"text.txt\").write_text(\"The cat sat on the mat. Then the dog came. There is nothing here.\\n\")"
       ]
      },
      "c": "from pathlib import Path\nPath(\"text.txt\").write_text(\"The cat sat on the mat. Then the dog came. There is nothing here.\\n\")",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Count the occurrences with {{count()}}.",
      "k": {
       "count()": [
        "contents.lower().count(\"the\") also counts \"then\", \"there\". count(\"the \") (with a space) is more precise.",
        "contents = Path(\"text.txt\").read_text().lower()\ntotal = contents.count(\"the\")\nwith_space = contents.count(\"the \")\nprint(f\"Occurrences of 'the': {total}\")\nprint(f\"Occurrences of 'the ' (with a space): {with_space}\")"
       ]
      },
      "c": "contents = Path(\"text.txt\").read_text().lower()\ntotal = contents.count(\"the\")\nwith_space = contents.count(\"the \")\nprint(f\"Occurrences of 'the': {total}\")\nprint(f\"Occurrences of 'the ' (with a space): {with_space}\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\.\\w+\\(\\)\\.\\w+\\(\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ],
      "so": [
       "Occurrences of 'the': 5",
       "Occurrences of 'the ' (with a space): 3"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-11",
    "t": "Favorite Number",
    "orig": "Favorite Number",
    "lvl": 2,
    "tr": "Write a program that prompts the user for their favorite number. Use <code>json.dumps()</code> to store this number in a file. Write a separate program that reads this value and prints the message <i>\"I know your favorite number! It's [number]\"</i>.",
    "steps": [
     {
      "f": "Ask for the number and save it to a {{JSON}} file.",
      "k": {
       "JSON": [
        "<code>json.dumps()</code> converts a Python object into a JSON string. Then <code>Path.write_text()</code> saves it.",
        "import json\nfrom pathlib import Path\nnumber = input(\"What is your favorite number? \")\npath = Path(\"favorite_number.json\")\npath.write_text(json.dumps(number))"
       ]
      },
      "c": "import json\nfrom pathlib import Path\nnumber = input(\"What is your favorite number? \")\npath = Path(\"favorite_number.json\")\npath.write_text(json.dumps(number))",
      "re": [
       "^import\\s+json\\s*$",
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)\\s*\\)$"
      ]
     },
     {
      "f": "In the second program, read and {{print}} the number.",
      "k": {
       "print": [
        "<code>json.loads()</code> converts the JSON string back into a Python object.",
        "import json\nfrom pathlib import Path\npath = Path(\"favorite_number.json\")\ncontents = path.read_text()\nnumber = json.loads(contents)\nprint(f\"I know your favorite number! It's {number}\")"
       ]
      },
      "c": "import json\nfrom pathlib import Path\npath = Path(\"favorite_number.json\")\ncontents = path.read_text()\nnumber = json.loads(contents)\nprint(f\"I know your favorite number! It's {number}\")",
      "re": [
       "^import\\s+json\\s*$",
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-12",
    "t": "Favorite Number Remembered",
    "orig": "Favorite Number Remembered",
    "lvl": 3,
    "tr": "Combine the two programs from Exercise 10-11 into a single file. If the number is already stored, report it back to the user. If it isn't, prompt for their favorite number and save it. Run the program twice to check that it works.",
    "steps": [
     {
      "f": "Check whether the file {{exists}} using exists().",
      "k": {
       "exists": [
        "<code>path.exists()</code> returns True if the file exists. If it does, read the value with json.loads(); otherwise, prompt for input.",
        "import json\nfrom pathlib import Path\npath = Path(\"favorite_number.json\")\nif path.exists():\n    number = json.loads(path.read_text())\n    print(f\"I know your favorite number! It's {number}\")"
       ]
      },
      "c": "import json\nfrom pathlib import Path\npath = Path(\"favorite_number.json\")\nif path.exists():\n    number = json.loads(path.read_text())\n    print(f\"I know your favorite number! It's {number}\")",
      "re": [
       "^import\\s+json\\s*$",
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^if\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\)\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Add the {{else}} branch to ask for it and save it.",
      "k": {
       "else": [
        "If the file doesn't exist, ask for the number and write it.",
        "else:\n    number = input(\"What is your favorite number? \")\n    path.write_text(json.dumps(number))\n    print(f\"I'll remember your favorite number, {number}!\")"
       ]
      },
      "c": "else:\n    number = input(\"What is your favorite number? \")\n    path.write_text(json.dumps(number))\n    print(f\"I'll remember your favorite number, {number}!\")",
      "re": [
       "^else\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-13",
    "t": "User Dictionary",
    "orig": "User Dictionary",
    "lvl": 3,
    "tr": "The remember_me.py example stores only one piece of information. Expand it by asking for two more pieces of information about the user (for example, their age and city) and store everything in a dictionary. Write the dictionary to a file with json.dumps() and read it back with json.loads(). Print a summary of what the program remembers.",
    "steps": [
     {
      "f": "Create the {{user}} dictionary with three keys.",
      "k": {
       "user": [
        "Name, age, city. Or anything else you want.",
        "user = {\"name\": input(\"Name: \"), \"age\": int(input(\"Age: \")), \"city\": input(\"City: \")}"
       ]
      },
      "c": "user = {\"name\": input(\"Name: \"), \"age\": int(input(\"Age: \")), \"city\": input(\"City: \")}",
      "re": "^\\w+\\s*=\\s*\\{\\s*[\"']name[\"'].+[\"']age[\"'].+[\"']city[\"'].*\\}$"
     },
     {
      "f": "Save the dictionary as {{JSON}} and print the summary.",
      "k": {
       "JSON": [
        "Serialize the dictionary, then write it to the file. Then read it back and display it.",
        "from pathlib import Path\nimport json\npath = Path(\"user.json\")\npath.write_text(json.dumps(user))\nretrieved = json.loads(path.read_text())\nfor k, v in retrieved.items():\n    print(f\"{k}: {v}\")"
       ]
      },
      "c": "from pathlib import Path\nimport json\npath = Path(\"user.json\")\npath.write_text(json.dumps(user))\nretrieved = json.loads(path.read_text())\nfor k, v in retrieved.items():\n    print(f\"{k}: {v}\")",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^import\\s+json\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\)\\s*\\)$",
       "^for\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+\\w+\\.items\\(\\)\\s*:$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     }
    ],
    "ch": 10
   },
   {
    "id": "10-14",
    "t": "Verify User",
    "orig": "Verify User",
    "lvl": 3,
    "tr": "The final version of remember_me.py assumes the user has already entered their name, or that the program is running for the first time. Modify it for the case where the current user is not the person who used the program last. Before printing the welcome-back message, ask the user whether the name is correct. If it isn't, call <code>get_new_username()</code>.",
    "steps": [
     {
      "f": "Import {{json}} and {{Path}}, then define the two helper functions.",
      "k": {
       "json": [
        "You need these to read and write the username.json file.",
        "import json\nfrom pathlib import Path"
       ],
       "Path": [
        "Path turns a string into a path, with the exists/read_text/write_text methods.",
        "import json\nfrom pathlib import Path"
       ],
       "get_stored_username": [
        "Reads the file if it exists, otherwise returns None.",
        "def get_stored_username(path):\n    if path.exists():\n        return json.loads(path.read_text())\n    return None"
       ],
       "get_new_username": [
        "Asks for input and saves it.",
        "def get_new_username(path):\n    username = input(\"What is your name? \")\n    path.write_text(json.dumps(username))\n    return username"
       ]
      },
      "c": "import json\nfrom pathlib import Path\n\ndef get_stored_username(path):\n    if path.exists():\n        return json.loads(path.read_text())\n    return None\n\ndef get_new_username(path):\n    username = input(\"What is your name? \")\n    path.write_text(json.dumps(username))\n    return username",
      "re": [
       "^import\\s+json\\s*$",
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^if\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^return\\s+\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\)\\s*\\)$",
       "^return\\s+None\\s*$",
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*input\\(.+\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)\\s*\\)$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "In the greet_user function, ask for {{confirm}}.",
      "k": {
       "confirm": [
        "If the username exists, ask \"Is this you?\". If the answer is 'no', call get_new_username.",
        "def greet_user():\n    path = Path(\"username.json\")\n    username = get_stored_username(path)\n    if username:\n        correct = input(f\"Are you {username}? (yes/no) \")\n        if correct.lower() == \"no\":\n            username = get_new_username(path)\n        print(f\"Welcome back, {username}!\")\n    else:\n        username = get_new_username(path)\n        print(f\"I'll remember you, {username}!\")"
       ]
      },
      "c": "def greet_user():\n    path = Path(\"username.json\")\n    username = get_stored_username(path)\n    if username:\n        correct = input(f\"Are you {username}? (yes/no) \")\n        if correct.lower() == \"no\":\n            username = get_new_username(path)\n        print(f\"Welcome back, {username}!\")\n    else:\n        username = get_new_username(path)\n        print(f\"I'll remember you, {username}!\")",
      "re": [
       "^def\\s+\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*\\)$",
       "^if\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*input\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^if\\s+\\w+\\.\\w+\\(\\)\\s*==\\s*[\"']no[\"']\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$",
       "^else\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*\\)$",
       "^print\\s*\\(\\s*f[\"'].*\\{[^}]*\\}.*[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Call {{greet_user}} to start the program.",
      "k": {
       "greet_user": [
        "The final call starts everything.",
        "greet_user()"
       ]
      },
      "c": "greet_user()",
      "re": "^\\w+\\(\\)\\s*$"
     }
    ],
    "ch": 10
   }
  ]
 },
 {
  "n": 11,
  "t": "Testing Your Code",
  "sub": "Writing unit tests with pytest for functions and classes",
  "concepts": [
   "Installing pytest",
   "The test file and the test_ functions",
   "Assert: ==, !=, in, not in",
   "Testing classes and methods",
   "pytest fixtures"
  ],
  "ex": [
   {
    "id": "11-1",
    "t": "City, Country",
    "orig": "City, Country",
    "lvl": 2,
    "tr": "Write a function that accepts two parameters: a city name and a country name. The function should return a string in the format City, Country, like <i>Santiago, Chile</i>. Save the function in a module called <code>city_functions.py</code> in a new folder. Create a file <code>test_cities.py</code> that tests the function. Write a <code>test_city_country()</code> function to verify that calling the function with 'santiago' and 'chile' returns the correct string.",
    "steps": [
     {
      "f": "Create the {{city_functions.py}} module with the function.",
      "k": {
       "city_functions.py": [
        "The function returns the formatted string.",
        "def city_country(city, country):\n    return f\"{city.title()}, {country.title()}\""
       ]
      },
      "c": "def city_country(city, country):\n    return f\"{city.title()}, {country.title()}\"",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^return\\s+f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*$"
      ]
     },
     {
      "f": "Write the {{test}} in the file test_cities.py.",
      "k": {
       "test": [
        "Import the function, then define <code>test_city_country()</code>. Use <code>assert</code> to compare the result.",
        "from city_functions import city_country\n\ndef test_city_country():\n    result = city_country(\"santiago\", \"chile\")\n    assert result == \"Santiago, Chile\""
       ]
      },
      "c": "from city_functions import city_country\n\ndef test_city_country():\n    result = city_country(\"santiago\", \"chile\")\n    assert result == \"Santiago, Chile\"",
      "re": [
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^def\\s+test_\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\)$",
       "^assert\\s+\\w+\\s*==\\s*[\"'].+[\"']\\s*$"
      ],
      "note": "On the tutor, press \"▶ Run and check\": pytest really runs in the browser and tests <b>your</b> function (your city_functions.py is used by the test)."
     }
    ],
    "files": [
     "city_functions.py",
     "test_cities.py"
    ],
    "ch": 11
   },
   {
    "id": "11-2",
    "t": "Population",
    "orig": "Population",
    "lvl": 2,
    "tr": "Modify your function from Exercise 11-1 so it takes a third, optional parameter, <code>population</code>. The function should now return a string like <i>Santiago, Chile - population 5000000</i>. If no population is passed, fall back to the original format. Update the <code>test_city_country()</code> test to make sure it still passes with the original arguments. Write a new <code>test_city_country_population()</code> test that checks a call with 'santiago', 'chile', and population=5000000.",
    "steps": [
     {
      "f": "Update the function with the {{population}} parameter.",
      "k": {
       "population": [
        "The parameter defaults to None. Use if population: to build the string with or without the population.",
        "def city_country(city, country, population=None):\n    base = f\"{city.title()}, {country.title()}\"\n    if population:\n        return f\"{base} - population {population}\"\n    return base"
       ]
      },
      "c": "def city_country(city, country, population=None):\n    base = f\"{city.title()}, {country.title()}\"\n    if population:\n        return f\"{base} - population {population}\"\n    return base",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*None\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*$",
       "^if\\s+\\w+\\s*:$",
       "^return\\s+f[\"'].*\\{[^}]*\\}.+\\{[^}]*\\}.*[\"']\\s*$",
       "^return\\s+\\w+\\s*$"
      ]
     },
     {
      "f": "Add the test for the {{population}}.",
      "k": {
       "population": [
        "A new test function.",
        "def test_city_country_population():\n    result = city_country(\"santiago\", \"chile\", 5000000)\n    assert result == \"Santiago, Chile - population 5000000\""
       ]
      },
      "c": "def test_city_country_population():\n    result = city_country(\"santiago\", \"chile\", 5000000)\n    assert result == \"Santiago, Chile - population 5000000\"",
      "re": [
       "^def\\s+test_\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*\\)$",
       "^assert\\s+\\w+\\s*==\\s*[\"'].+[\"']\\s*$"
      ]
     }
    ],
    "ch": 11
   },
   {
    "id": "11-3",
    "t": "Employee",
    "orig": "Employee",
    "lvl": 3,
    "tr": "Write an <code>Employee</code> class. The <code>__init__()</code> method should take a first name, a last name, and an annual salary, and store them as attributes. Write a <code>give_raise()</code> method that adds $5,000 to the salary by default but also accepts a different amount. Write a test file for Employee with two test functions: <code>test_give_default_raise()</code> and <code>test_give_custom_raise()</code>. Write the tests first without a fixture, then with a fixture that creates the instance.",
    "steps": [
     {
      "f": "Define the {{Employee}} class.",
      "k": {
       "Employee": [
        "The __init__ and give_raise methods.",
        "class Employee:\n    def __init__(self, first_name, last_name, salary):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.salary = salary\n    def give_raise(self, amount=5000):\n        self.salary += amount"
       ]
      },
      "c": "class Employee:\n    def __init__(self, first_name, last_name, salary):\n        self.first_name = first_name\n        self.last_name = last_name\n        self.salary = salary\n    def give_raise(self, amount=5000):\n        self.salary += amount",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*,\\s*\\w+\\s*=\\s*5000\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*\\+=\\s*\\w+$"
      ]
     },
     {
      "f": "Write the {{test}} with the fixture.",
      "k": {
       "test": [
        "The <code>employee</code> fixture creates the instance just once. The tests use it as a parameter.",
        "import pytest\nfrom employee import Employee\n\n@pytest.fixture\ndef employee():\n    return Employee(\"Mario\", \"Rossi\", 50000)\n\ndef test_give_default_raise(employee):\n    employee.give_raise()\n    assert employee.salary == 55000\n\ndef test_give_custom_raise(employee):\n    employee.give_raise(10000)\n    assert employee.salary == 60000"
       ]
      },
      "c": "import pytest\nfrom employee import Employee\n\n@pytest.fixture\ndef employee():\n    return Employee(\"Mario\", \"Rossi\", 50000)\n\ndef test_give_default_raise(employee):\n    employee.give_raise()\n    assert employee.salary == 55000\n\ndef test_give_custom_raise(employee):\n    employee.give_raise(10000)\n    assert employee.salary == 60000",
      "re": [
       "^import\\s+pytest\\s*$",
       "^from\\s+\\w+\\s+import\\s+\\w+\\s*$",
       "^@pytest\\.fixture\\s*$",
       "^def\\s+\\w+\\(\\)\\s*:$",
       "^return\\s+\\w+\\(\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\d+\\s*\\)$",
       "^def\\s+test_\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\)$",
       "^assert\\s+\\w+\\.\\w+\\s*==\\s*\\d+$",
       "^def\\s+test_\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\s*\\d+\\s*\\)$",
       "^assert\\s+\\w+\\.\\w+\\s*==\\s*\\d+$"
      ],
      "note": "On the tutor, press \"▶ Run and check\": pytest really runs in the browser and tests <b>your</b> Employee class."
     }
    ],
    "files": [
     "employee.py",
     "test_employee.py"
    ],
    "ch": 11
   }
  ]
 },
 {
  "n": 12,
  "t": "Project: Alien Invasion (Pygame)",
  "sub": "Building the ship, handling events, and firing bullets",
  "concepts": [
   "Initializing Pygame",
   "The game loop and events",
   "The Settings and Ship classes",
   "Blitting images",
   "Movement and screen edges",
   "The Bullet class"
  ],
  "ex": [
   {
    "id": "12-1",
    "t": "Blue Sky",
    "orig": "Blue Sky",
    "lvl": 1,
    "tr": "Make a Pygame window with a blue background: in the browser the game appears in the Game panel — click the canvas and close it with the <code>q</code> key (or press ■ Stop).",
    "steps": [
     {
      "f": "Initialize Pygame and make a {{blue}} window.",
      "k": {
       "blue": [
        "Use <code>pygame.display.set_mode()</code> and <code>screen.fill()</code> with an RGB tuple for blue.",
        "import pygame\npygame.init()\nscreen = pygame.display.set_mode((800, 600))\nscreen.fill((0, 0, 255))\npygame.display.flip()"
       ]
      },
      "c": "import pygame\npygame.init()\nscreen = pygame.display.set_mode((800, 600))\nscreen.fill((0, 0, 255))\npygame.display.flip()",
      "re": [
       "^import\\s+pygame\\s*$",
       "^pygame\\.init\\(\\)\\s*$",
       "^\\w+\\s*=\\s*pygame\\.display\\.set_mode\\(\\s*\\(\\s*\\d+\\s*,\\s*\\d+\\s*\\)\\s*\\)$",
       "^\\w+\\.\\w+\\(\\s*\\(\\s*0\\s*,\\s*0\\s*,\\s*255\\s*\\)\\s*\\)$",
       "^pygame\\.display\\.flip\\(\\)\\s*$"
      ],
      "btn": "✓ Tested locally"
     },
     {
      "f": "Import the {{sys}} module: it's needed to exit cleanly.",
      "k": {
       "sys": [
        "<code>sys.exit()</code> ends the program when the game window closes.",
        "import sys"
       ]
      },
      "c": "import sys",
      "re": "^import\\s+sys\\s*$"
     },
     {
      "f": "Add the main {{loop}}: it keeps the window open, handles the close event, and responds to the q key.",
      "k": {
       "loop": [
        "<code>while True:</code> repeats event handling and redrawing: on <code>pygame.QUIT</code> or on the <code>q</code> key (a KEYDOWN event), quit pygame and exit. The clock caps the loop at 60 FPS: without a cap the loop eats up the whole CPU. As an alternative to KEYDOWN you can read the keyboard with <code>pygame.key.get_pressed()</code>.",
        "clock = pygame.time.Clock()\nwhile True:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            pygame.quit()\n            sys.exit()\n        if event.type == pygame.KEYDOWN:\n            if event.key == pygame.K_q:\n                pygame.quit()\n                sys.exit()\n    screen.fill((0, 0, 255))\n    pygame.display.flip()\n    clock.tick(60)"
       ]
      },
      "c": "clock = pygame.time.Clock()\nwhile True:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            pygame.quit()\n            sys.exit()\n        if event.type == pygame.KEYDOWN:\n            if event.key == pygame.K_q:\n                pygame.quit()\n                sys.exit()\n    screen.fill((0, 0, 255))\n    pygame.display.flip()\n    clock.tick(60)",
      "re": [
       "^\\w+\\s*=\\s*pygame\\.time\\.Clock\\(\\)\\s*$",
       "^while\\s+True\\s*:$",
       "^for\\s+\\w+\\s+in\\s+pygame\\.event\\.get\\(\\)\\s*:$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.QUIT\\s*:$",
       "^pygame\\.quit\\(\\)\\s*$",
       "^sys\\.exit\\(\\)\\s*$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.KEYDOWN\\s*:$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.K_q\\s*:$",
       "^pygame\\.quit\\(\\)\\s*$",
       "^sys\\.exit\\(\\)\\s*$",
       "^\\w+\\.fill\\(\\s*\\(\\s*0\\s*,\\s*0\\s*,\\s*255\\s*\\)\\s*\\)$",
       "^pygame\\.display\\.flip\\(\\)\\s*$",
       "^\\w+\\.tick\\(\\s*\\d+\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 12
   },
   {
    "id": "12-2",
    "t": "Game Character",
    "orig": "Game Character",
    "lvl": 2,
    "tr": "Find a bitmap image of a character and make a class that draws it at the center of the screen. On the tutor the <code>bird.bmp</code> image is already in the runtime: use it in the load.",
    "steps": [
     {
      "f": "Create the {{Bird}} class that loads the image.",
      "k": {
       "Bird": [
        "In the __init__ method, load the image with pygame.image.load() and get its rect.",
        "class Bird:\n    def __init__(self, screen):\n        self.screen = screen\n        self.image = pygame.image.load(\"bird.bmp\")\n        self.rect = self.image.get_rect()\n        self.rect.center = screen.get_rect().center\n    def blitme(self):\n        self.screen.blit(self.image, self.rect)"
       ]
      },
      "c": "class Bird:\n    def __init__(self, screen):\n        self.screen = screen\n        self.image = pygame.image.load(\"bird.bmp\")\n        self.rect = self.image.get_rect()\n        self.rect.center = screen.get_rect().center\n    def blitme(self):\n        self.screen.blit(self.image, self.rect)",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.image\\.load\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)\\.\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\(\\s*self\\.\\w+\\s*,\\s*self\\.\\w+\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "bird.bmp": {
      "b64": "Qk2mJgAAAAAAADYAAAAoAAAAPAAAANf///8BACAAAAAAAAAAAAATCwAAEwsAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AQAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AgIB/xEOBf8WEwf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/FhIH/xYSB/8WEgf/DQsE/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AQAA/wAAAP8ZFQj/GhUI/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/yAbDP8QDQT/AAAA/wEBAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAAD/AAAA/x0ZCv8AAAD/AAAA/1FHKP9rXjb/al02/2pdNv9qXjb/al42/2peNv9qXjb/al42/2pdNv9qXjb/al42/2peNv9qXjb/al42/2peNv9qXjb/al42/2peNv9qXjb/al02/2peNv9pXDX/PjYd/wAAAP8AAAD/GBQI/wAAAP8BAQD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/HRgK/wAAAP9uYDf/1Ltw/+/U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w/8AAAD/AAAA/xRuvP8Ubbv/CUZ6/x6S9v8OWZr/AAAA/wENHf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8ABhH/AAAA/wIeOf8ekvb/HYzt/wMlRP8AAAD/AAsa/wAAAP8AAAD/GYHa/x2N7v8BFSn/AAAA/wAEDP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAQT/AAAA/wEVKv8SZq7/BCtO/wAAAP8ACRf/AAAA/wENHv8AAwf/FG67/whAcf8AAAD/AAoZ/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAED/wAAAP8AAAD/AAAA/wAJF/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8ACBb/AAAA/wAAAf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/"
     }
    },
    "ch": 12
   },
   {
    "id": "12-3",
    "t": "Pygame Documentation",
    "orig": "Pygame Documentation",
    "lvl": 1,
    "tr": "Take a look at the Pygame documentation at https://pygame.org/docs.",
    "steps": [
     {
      "f": "Visit the site and {{browse}} the documentation.",
      "k": {
       "browse": [
        "No code needed: explore the \"Display\" and \"Sprite\" sections.",
        "https://pygame.org/docs"
       ]
      },
      "c": null,
      "btn": "✓ Documentation browsed"
     }
    ],
    "ch": 12
   },
   {
    "id": "12-4",
    "t": "Rocket",
    "orig": "Rocket",
    "lvl": 3,
    "tr": "Make a game that starts with a rocket in the center of the screen (on the tutor the <code>rocket.png</code> image is already in the runtime). Let the player move the rocket up, down, left, and right with the arrow keys. Make sure the rocket never goes past the edges of the screen.",
    "steps": [
     {
      "f": "Create the {{Rocket}} class with the movement flags.",
      "k": {
       "Rocket": [
        "Similar to Ship, but with 4 flags (moving_up, moving_down, moving_left, moving_right).",
        "class Rocket:\n    def __init__(self, screen):\n        self.screen = screen\n        self.image = pygame.image.load(\"rocket.png\")\n        self.rect = self.image.get_rect()\n        self.rect.center = screen.get_rect().center\n        self.moving_up = False\n        self.moving_down = False\n        self.moving_left = False\n        self.moving_right = False\n    def update(self):\n        if self.moving_up and self.rect.top > 0:\n            self.rect.y -= 2\n        if self.moving_down and self.rect.bottom < self.screen.get_rect().bottom:\n            self.rect.y += 2\n        if self.moving_left and self.rect.left > 0:\n            self.rect.x -= 2\n        if self.moving_right and self.rect.right < self.screen.get_rect().right:\n            self.rect.x += 2"
       ]
      },
      "c": "class Rocket:\n    def __init__(self, screen):\n        self.screen = screen\n        self.image = pygame.image.load(\"rocket.png\")\n        self.rect = self.image.get_rect()\n        self.rect.center = screen.get_rect().center\n        self.moving_up = False\n        self.moving_down = False\n        self.moving_left = False\n        self.moving_right = False\n    def update(self):\n        if self.moving_up and self.rect.top > 0:\n            self.rect.y -= 2\n        if self.moving_down and self.rect.bottom < self.screen.get_rect().bottom:\n            self.rect.y += 2\n        if self.moving_left and self.rect.left > 0:\n            self.rect.x -= 2\n        if self.moving_right and self.rect.right < self.screen.get_rect().right:\n            self.rect.x += 2",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.image\\.load\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+\\.\\w+\\(\\)\\.\\w+$",
       "^self\\.\\w+\\s*=\\s*False$",
       "^self\\.\\w+\\s*=\\s*False$",
       "^self\\.\\w+\\s*=\\s*False$",
       "^self\\.\\w+\\s*=\\s*False$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^if\\s+self\\.\\w+\\s+and\\s+self\\.\\w+\\.\\w+\\s*>\\s*0\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*-=\\s*\\d+$",
       "^if\\s+self\\.\\w+\\s+and\\s+self\\.\\w+\\.\\w+\\s*<\\s*self\\.\\w+\\.\\w+\\(\\)\\.\\w+\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*\\d+$",
       "^if\\s+self\\.\\w+\\s+and\\s+self\\.\\w+\\.\\w+\\s*>\\s*0\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*-=\\s*\\d+$",
       "^if\\s+self\\.\\w+\\s+and\\s+self\\.\\w+\\.\\w+\\s*<\\s*self\\.\\w+\\.\\w+\\(\\)\\.\\w+\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*\\d+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "rocket.png": {
      "b64": "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"
     }
    },
    "ch": 12
   },
   {
    "id": "12-5",
    "t": "Keys",
    "orig": "Keys",
    "lvl": 2,
    "tr": "Make a Pygame file with an empty screen. In the event loop, print the <code>event.key</code> attribute whenever a <code>pygame.KEYDOWN</code> event is detected. Run the program and press various keys.",
    "steps": [
     {
      "f": "Set up the {{window}} and open the main loop.",
      "k": {
       "window": [
        "Import pygame and sys, initialize, create the window, and open <code>while True:</code>.",
        "import pygame\nimport sys\npygame.init()\nscreen = pygame.display.set_mode((800, 600))\nwhile True:"
       ]
      },
      "c": "import pygame\nimport sys\npygame.init()\nscreen = pygame.display.set_mode((800, 600))\nwhile True:",
      "re": [
       "^import\\s+pygame\\s*$",
       "^import\\s+sys\\s*$",
       "^pygame\\.init\\(\\)\\s*$",
       "^\\w+\\s*=\\s*pygame\\.display\\.set_mode\\(\\s*\\(\\s*\\d+\\s*,\\s*\\d+\\s*\\)\\s*\\)$",
       "^while\\s+True\\s*:$"
      ],
      "btn": "✓ Tested locally"
     },
     {
      "f": "Write the {{events}} loop that prints the pressed key.",
      "k": {
       "events": [
        "Inside the loop, check for <code>pygame.KEYDOWN</code> and print <code>event.key</code>; handle <code>pygame.QUIT</code> and refresh the screen with <code>pygame.display.flip()</code>.",
        "    for event in pygame.event.get():\n        if event.type == pygame.KEYDOWN:\n            print(event.key)\n        if event.type == pygame.QUIT:\n            pygame.quit()\n            sys.exit()\n    pygame.display.flip()"
       ]
      },
      "c": "    for event in pygame.event.get():\n        if event.type == pygame.KEYDOWN:\n            print(event.key)\n        if event.type == pygame.QUIT:\n            pygame.quit()\n            sys.exit()\n    pygame.display.flip()",
      "re": [
       "^for\\s+\\w+\\s+in\\s+pygame\\.event\\.get\\(\\)\\s*:$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.KEYDOWN\\s*:$",
       "^print\\s*\\(\\s*\\w+\\.\\w+\\s*\\)$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.QUIT\\s*:$",
       "^pygame\\.quit\\(\\)\\s*$",
       "^sys\\.exit\\(\\)\\s*$",
       "^pygame\\.display\\.flip\\(\\)\\s*$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 12
   },
   {
    "id": "12-6",
    "t": "Sideways Shooter",
    "orig": "Sideways Shooter",
    "lvl": 3,
    "tr": "Write a game that places a ship on the left side of the screen and lets the player move it up and down. Have the ship fire a bullet that travels to the right whenever the spacebar is pressed. Make sure bullets are deleted once they disappear off the screen.",
    "steps": [
     {
      "f": "Create the {{Bullet}} class for horizontal movement.",
      "k": {
       "Bullet": [
        "The bullet moves right: <code>self.rect.x += self.settings.bullet_speed</code>.",
        "class Bullet:\n    def __init__(self, screen, ship):\n        self.screen = screen\n        self.rect = pygame.Rect(0, 0, 3, 15)\n        self.rect.midleft = ship.rect.midleft\n    def update(self):\n        self.rect.x += 2"
       ]
      },
      "c": "class Bullet:\n    def __init__(self, screen, ship):\n        self.screen = screen\n        self.rect = pygame.Rect(0, 0, 3, 15)\n        self.rect.midleft = ship.rect.midleft\n    def update(self):\n        self.rect.x += 2",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.Rect\\(\\s*0\\s*,\\s*0\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*\\d+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 12
   }
  ]
 },
 {
  "n": 13,
  "t": "Project: Alien Invasion (Aliens and Collisions)",
  "sub": "Building the fleet, moving it, and handling collisions",
  "concepts": [
   "The Alien class",
   "The fleet with _create_fleet()",
   "Fleet movement and direction changes",
   "Bullet-alien collisions",
   "Alien-ship collisions",
   "Game over"
  ],
  "ex": [
   {
    "id": "13-1",
    "t": "Stars",
    "orig": "Stars",
    "lvl": 2,
    "tr": "Find an image of a star and make a grid of stars on the screen (on the tutor the <code>star.png</code> image is already in the runtime).",
    "steps": [
     {
      "f": "Create the {{Star}} class and the grid.",
      "k": {
       "Star": [
        "Use two nested loops (rows and columns) to place the stars.",
        "class Star:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"star.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def blitme(self):\n        self.screen.blit(self.image, self.rect)"
       ]
      },
      "c": "class Star:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"star.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def blitme(self):\n        self.screen.blit(self.image, self.rect)",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.image\\.load\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\(\\s*self\\.\\w+\\s*,\\s*self\\.\\w+\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "star.png": {
      "b64": "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"
     }
    },
    "ch": 13
   },
   {
    "id": "13-2",
    "t": "Better Stars",
    "orig": "Better Stars",
    "lvl": 2,
    "tr": "Make the pattern more realistic by introducing randomness when you place each star. Use <code>randint()</code> to adjust each star's position.",
    "steps": [
     {
      "f": "Add {{randomness}} to the positions.",
      "k": {
       "randomness": [
        "Import randint and add it to the x and y coordinates of each star.",
        "from random import randint\n# ... inside the creation loop:\nx = column * star_width + randint(-10, 10)\ny = row * star_height + randint(-10, 10)"
       ]
      },
      "c": "from random import randint\nx = column * star_width + randint(-10, 10)\ny = row * star_height + randint(-10, 10)",
      "re": [
       "^from\\s+random\\s+import\\s+randint\\s*$",
       "^\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+\\s*\\+\\s*randint\\(\\s*-10\\s*,\\s*10\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\s*\\*\\s*\\w+\\s*\\+\\s*randint\\(\\s*-10\\s*,\\s*10\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 13
   },
   {
    "id": "13-3",
    "t": "Raindrops",
    "orig": "Raindrops",
    "lvl": 2,
    "tr": "Find an image of a raindrop and make a grid of drops (on the tutor the <code>drop.png</code> image is already in the runtime). Make the drops fall straight down until they disappear.",
    "steps": [
     {
      "f": "Create the {{Raindrop}} class with downward movement.",
      "k": {
       "Raindrop": [
        "Very similar to Star, but with an update() method that increases y.",
        "class Raindrop:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"drop.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def update(self):\n        self.rect.y += 1"
       ]
      },
      "c": "class Raindrop:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"drop.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def update(self):\n        self.rect.y += 1",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.image\\.load\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*1$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "drop.png": {
      "b64": "iVBORw0KGgoAAAANSUhEUgAAADIAAABMCAYAAAAvF+QAAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAGUUlEQVRoBe1ba2hcRRTOvrLZkMSmpuAPQavJbrRiahCLadFYKyHZPNjStFRFqehWKlitKIJW0mKpSisq4g/1rwqN2rzxh0gQwYJgwUfaZFFjlOSHSAppksbN7vqdsDPe3b1z79xX9q70wjJzz5xz5vvmzOvOvVtWdvWSa4H29vZN3d3d98hpm9fymjeVswwEAntSqdRDctrmtRwnkk6n93k8nt3xeDxgHqa+paNEOjo6rgOEHfjVzczM7NSHY17DUSKIRC+g+Qiez+fbax6mvqWjRFD9PgYBpGIY+EF2b3fqGJFoNHobwLYoANf6/f79intbs44RAcpnEQWPEi0G/hHc58iU5Vbyjjjt6uqqy2QyMwAWUgF338jIyLiK3JLIkYig5eNApUaCwB62hFhgbHtEWltb/VVVVb+hvusFdaYxVsIDAwO/CMpNiW2PSHV1NQ1oEQkC6cVK/5wptBpGtkakt7fXt7y8/DPqi2jUWYbxk/R6vZHh4WGKnC2XrRFZXFx8BKg0SRBqTGYBjKOXbGGQdWJbRGgvNTs7exF+b5IEmEJUtgwNDU1K6muq2RaRubm5Rw2QIFA+ROWoJjoDhbZEhLYeaN2L6DI3GqibVNPYg20dHBz80aBdgbotEQGBp02QIDA0g71VgMqEYG1nasKOm7S1tW1Eq54BEdECyHUFmc0NDQ3nE4mEpbFiOSJY3I6BxEYBSFnxm1Z3xpaI4FmcptqDsmhFemiIm/F7SlQuI7dEBP37DQCw5REWk8VROqiQAa2mY5oIovEASHSrOTUp2wAyJ03amns2wFakHFuRH1Cp7ipuBBi2Lhk0znZs8781Yke6piKysrLyDGxtJUFgQILWtXdpz0b3Ri7DROhkxO59Uh7g5qWlpYN5Mt1bw0TQj0/Ba42uZwsKCMyrRge+ISI9PT0t6MYPWsAoa1prdOBLE+nr6/Ourq6+ne3HsoCs6D3W2dl5t6wD6UFVU1PzJJw+IevYql62wZqbmpo+nJiYyOj5k4oI7acwwI/rOXOg/A7ZgS9FJBgMEok6B4DquqSBH4vFrtVT1CWCM6pGbEXoeKdYV20ymXxFr3JdIuhSp9Aqtuyn9MBolB9Cg27RKNde2WG8EySiWg7WqcyPBn1dqy6tiHiwZpzWMl7PMmpQTMf3i+oUEkE0emC0VWRYDDka9rioXiERh/dTIjyackSlBbuLXWpKqkQQwi4Y3almUGwZdhfH1DCoEoHiy2rKbpBRVGgSysdSQISe/KB0V76im+7R7Z/Px1NABEov5iu58L4t+2qPQ8shgmjUo6QgbFzbJRl0Lw/O0ujAnF85RCB9mJe4PIOeE1NCzCGCwj3KQpfn6/HYHWYYORHaqmPBuZUVlEKKU85mhpMTKS8v30Z9jxWUQoo15XaGkxMBh5KKBhEAZpqc1i5OBOOjKA9ODIiZFESuYXacCMaH7lMYM3JRuoFh4UQgUOZZecmkHDwicrlkUP8HdIFlORFMZX8zYamkaHyOmRMB+ESpEGA4MdinWJ4Twax1gQlLKKX3+msXJxIKhX6CZD4rL4kEjf8NA8qJ9Pf3p9DnvmYFJZAmxsbGfmc4ORESoM/1swK3p2j0M0qM+UTOopBPaUpFF+Y/UmLKIYLPjpZQ+IFSwY15ROOL0dHRnMkphwiBxguW01C84kYCDBMwnmB5lha8H5mcnFxobGwMQuFepuSmFCQ+Rc8pOAEtiAiBrqioOImo2PrNoU2NsYAJ6YiaL1UimIqXwZy+TfxHzahYMmA6hE+i/lCrv6BrMaWpqanZ+vr6ebRAB5MVM0UPeQ8fErwmwiAkQgb49Oi7cDhcgewOkYN1kg/je8kD09PTaVF9mkTICJH5CpEJITLbRU6clCMSn4PE/vHxcc1urkuEQCIyX0YikXk43QVCUjY2kXunsrLycWxFknr+DJ2aZN97fwKnN+g5tlh+CQM7ji9QpbdMhloX3exPROZ9VLKK6NDLfL9FwGrmI3j5GsXKfU6tUCQzFBGlExztbwaZFyA7gB8toFYuGsRn0UAnEIXzZhyZJsIqw6k4fTeyF88G9KewFshlSaWg+z0a4zM8Zn8sWh9YPXqpZSLKCvCdVQgfpG0DsVtwChhBuglAq6DjA8nLyP8F2a/IX0B6Dv9YuKS0v5r/P7XAv6MdquAWVSxXAAAAAElFTkSuQmCC"
     }
    },
    "ch": 13
   },
   {
    "id": "13-4",
    "t": "Steady Rain",
    "orig": "Steady Rain",
    "lvl": 3,
    "tr": "Modify your Exercise 13-3 code so that when a row of drops disappears off the bottom of the screen, a new row appears at the top and starts falling.",
    "steps": [
     {
      "f": "Add the position {{reset}} in update().",
      "k": {
       "reset": [
        "If <code>self.rect.top > screen_rect.bottom</code>, reset <code>self.rect.y = -self.rect.height</code>.",
        "def update(self):\n    self.rect.y += 1\n    if self.rect.top > self.screen.get_rect().bottom:\n        self.rect.y = -self.rect.height"
       ]
      },
      "c": "def update(self):\n    self.rect.y += 1\n    if self.rect.top > self.screen.get_rect().bottom:\n        self.rect.y = -self.rect.height",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*1$",
       "^if\\s+self\\.\\w+\\.\\w+\\s*>\\s*self\\.\\w+\\.\\w+\\(\\)\\.\\w+\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*-self\\.\\w+\\.\\w+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 13
   },
   {
    "id": "13-5",
    "t": "Sideways Shooter Part 2",
    "orig": "Sideways Shooter Part 2",
    "lvl": 3,
    "tr": "Add a fleet of aliens that moves sideways toward the ship (on the tutor the <code>alien.png</code> image is already in the runtime), or place them randomly on the right side. Make the aliens disappear when they're hit.",
    "steps": [
     {
      "f": "Create the {{Alien}} class and the group.",
      "k": {
       "Alien": [
        "Make an Alien class with an update() method that moves them left.",
        "class Alien:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"alien.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def update(self):\n        self.rect.x -= 1"
       ]
      },
      "c": "class Alien:\n    def __init__(self, screen, x, y):\n        self.screen = screen\n        self.image = pygame.image.load(\"alien.png\")\n        self.rect = self.image.get_rect()\n        self.rect.x = x\n        self.rect.y = y\n    def update(self):\n        self.rect.x -= 1",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\s*=\\s*pygame\\.image\\.load\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^self\\.\\w+\\s*=\\s*self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^self\\.\\w+\\.\\w+\\s*=\\s*\\w+$",
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\s*-=\\s*1$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "alien.png": {
      "b64": "iVBORw0KGgoAAAANSUhEUgAAAGAAAAAgCAYAAADtwH1UAAAAAXNSR0IArs4c6QAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAA7dJREFUaAXtWUtu2zAQpeUE6S5IgXQZoFdoztBlT9BN110VuUEvkGVukFPkDMkVDHhVJEjd7FrAlTqP0lDkiBIpyRaoOgRiasiZIefNR6SyUPNrRWDLi8B8UtNz2qwGvihK/NfbrQbyR5bp/jHPdf/p+JgBnoVtc9ikAzzQbQP/uXICeL6cnKBDS9rGpDdH4FHA1xWHgQeqMvIZ/F9VRoAH7VuZEcnaeVRuM/1fBp+Bx4657EjwN8IJKVuXbGQQaCb6JfgMPICNAf/7cgnWJG2dTQZw5DP4DDyQ5bIzp8jHvtFSioq62Jd72/dvErZPtYkwuKuBeG8GyD2TzMcoub3js+sFvEBnP8uzesjk/KU8y4f4GvNDndBQJAbanbQz3MYoaoJNI9kmDmxhqiaTc8Cjb5c09tk7PgjLvkIG9Iu/F41drLO1HjsIJ8DSFwuCr9Zzj3drjAM6QXeWJQJOOBgHwHjbCQxGD2d0OUADf/nnktWqp6Mn89z2MDYLkitDMLStFGHO5wCM/6a/N/RXO8OLtW+wATz0cYt1wsFnAQCDE7hd8YN79JcXscKOeCPy+jAegetKxZVCgJvA5yMLBqPAP9+eR20mPxt4pIzSPjHTu4HroQTJVjpC440pdoBKKfKzU7Mtuf1u+qx7em+zpz01czaQGCw1kX9/cu9oCtHr5drhl3T+1s2CvrR676hXvekPQj5Ey4uXpOX5X9L1C7dcWNL1e0CpOhO0A3RK0A+Xok6a7gDOvKRJizNPN+FRtFq5+oL0g+AP0XeCP0TfCn5J34j5az9NXipMrqME4c3ApShE4yIGfr6QSRpLYp4/Q6DvQxPImh+9brH0Q8VPPdZTIfqu4qde87fRt9U89bpJ+qaap143pstI1xGv9Vs0+PQY9aYMaeHAT+goOvYugOUnuw/gw1xM67oLQL7rPuDTX5ajhckAWe99MlONTQb+rgxqA79Nv/UuYAcgExYxTghFP6855iLGOpLpQ9HftlH7IsY8VeQTqauPvIjBCVS963cBy732IxGoo57LvlboEGKJhiNion9s/Z+0/Oyi/reVn8hvQTIDbB9o53BGYIJPPDaT7/ngy497/u8KctXlAMbWKKCLls4KTPicwdHPgv99b0d/D9BtXAy49mDks3GG4aeRMdGfXPlpe/nKG3AJwCAsYzLA4CsemgsuVJEr9/MDZPgyJuTTJ/1AY99N2wdaszNFgfWb2SIFVnIgkh76D3n5nce/3N7x2fsCfru8o2EnecUGDyZh+z9/38YD7i5sPQAAAABJRU5ErkJggg=="
     }
    },
    "ch": 13
   },
   {
    "id": "13-6",
    "t": "Game Over",
    "orig": "Game Over",
    "lvl": 3,
    "tr": "In Sideways Shooter, keep track of how many times the ship is hit and how many times an alien is hit. Decide on a condition that ends the game, and stop the loop when it happens.",
    "steps": [
     {
      "f": "Add {{score}} and lives to the game loop.",
      "k": {
       "score": [
        "Use one variable for lives and one for aliens destroyed. If lives reach 0, exit the loop.",
        "lives = 3\nscore = 0\nwhile lives > 0:\n    # ... game logic ...\n    if alien_hit:\n        score += 1\n    if ship_hit:\n        lives -= 1"
       ]
      },
      "c": "lives = 3\nscore = 0\nwhile lives > 0:\n    if alien_hit:\n        score += 1\n    if ship_hit:\n        lives -= 1",
      "re": [
       "^\\w+\\s*=\\s*3$",
       "^\\w+\\s*=\\s*0$",
       "^while\\s+\\w+\\s*>\\s*0\\s*:$",
       "^if\\s+\\w+\\s*:$",
       "^\\w+\\s*\\+=\\s*1$",
       "^if\\s+\\w+\\s*:$",
       "^\\w+\\s*-=\\s*1$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 13
   }
  ]
 },
 {
  "n": 14,
  "t": "Project: Alien Invasion (Scoring)",
  "sub": "Play button, levels, score and lives",
  "concepts": [
   "The Button class",
   "Starting and resetting the game",
   "Increasing speed and point values",
   "Displaying the score and level",
   "Remaining lives"
  ],
  "ex": [
   {
    "id": "14-1",
    "t": "Press P to Play",
    "orig": "Press P to Play",
    "lvl": 2,
    "tr": "Add code that lets the player press P to start the game. Move part of the code from <code>_check_play_button()</code> to a <code>_start_game()</code> method.",
    "steps": [
     {
      "f": "Add the {{P}} key in _check_keydown_events().",
      "k": {
       "P": [
        "If <code>event.key == pygame.K_p</code>, call <code>self._start_game()</code>.",
        "def _check_keydown_events(self, event):\n    if event.key == pygame.K_p:\n        self._start_game()"
       ]
      },
      "c": "def _check_keydown_events(self, event):\n    if event.key == pygame.K_p:\n        self._start_game()",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^if\\s+\\w+\\.\\w+\\s*==\\s*pygame\\.K_p\\s*:$",
       "^self\\.\\w+\\(\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-2",
    "t": "Target Practice",
    "orig": "Target Practice",
    "lvl": 3,
    "tr": "Make a rectangle on the right side of the screen that moves up and down. On the left side, make a ship that the player can move up and down while firing bullets at the rectangle. Add a Play button. When the player misses the target three times, end the game and show the Play button.",
    "steps": [
     {
      "f": "Create the {{target}} and the miss system.",
      "k": {
       "target": [
        "The target is a rectangle that moves. Keep track of misses in a variable.",
        "miss = 0\nwhile miss < 3:\n    # if the bullet passes the right edge without hitting the target\n    miss += 1"
       ]
      },
      "c": "miss = 0\nwhile miss < 3:\n    miss += 1",
      "re": [
       "^\\w+\\s*=\\s*0$",
       "^while\\s+\\w+\\s*<\\s*3\\s*:$",
       "^\\w+\\s*\\+=\\s*1$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-3",
    "t": "Challenging Target Practice",
    "orig": "Challenging Target Practice",
    "lvl": 3,
    "tr": "Start with your work from Exercise 14-2. Make the target move faster as the game proceeds. Return the target to its original speed when the player clicks Play.",
    "steps": [
     {
      "f": "Increase the {{speed}} and reset.",
      "k": {
       "speed": [
        "Use a speed_scale variable and multiply it by the target's speed. Reset it when the player clicks Play.",
        "speed_scale = 1.0\n# as the game proceeds\nspeed_scale *= 1.1\n# when the player clicks Play\nspeed_scale = 1.0"
       ]
      },
      "c": "speed_scale = 1.0\nspeed_scale *= 1.1\nspeed_scale = 1.0",
      "re": [
       "^\\w+\\s*=\\s*1\\.0$",
       "^\\w+\\s*\\*=\\s*1\\.1$",
       "^\\w+\\s*=\\s*1\\.0$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-4",
    "t": "Difficulty Levels",
    "orig": "Difficulty Levels",
    "lvl": 2,
    "tr": "Make a series of buttons for Alien Invasion that lets the player choose the starting difficulty level. Each button should assign the appropriate values to the settings.",
    "steps": [
     {
      "f": "Create the {{Easy}}, {{Medium}}, {{Hard}} buttons.",
      "k": {
       "Easy": [
        "A button that sets low speeds.",
        "easy_button = Button(ai_game, \"Easy\")"
       ],
       "Medium": [
        "A button that sets medium speeds.",
        "medium_button = Button(ai_game, \"Medium\")"
       ],
       "Hard": [
        "A button that sets high speeds.",
        "hard_button = Button(ai_game, \"Hard\")"
       ]
      },
      "c": "easy_button = Button(ai_game, \"Easy\")\nmedium_button = Button(ai_game, \"Medium\")\nhard_button = Button(ai_game, \"Hard\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*,\\s*[\"']Easy[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*,\\s*[\"']Medium[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*\\w+\\s*,\\s*[\"']Hard[\"']\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-5",
    "t": "All-Time High Score",
    "orig": "All-Time High Score",
    "lvl": 3,
    "tr": "The high score is reset every time the player closes and restarts the game. Fix this by writing the high score to a file before calling <code>sys.exit()</code>, and reading it back when you initialize its value in <code>GameStats</code>.",
    "steps": [
     {
      "f": "Read and write the {{high score}} to a file.",
      "k": {
       "high score": [
        "Use json and Path to save the high score.",
        "from pathlib import Path\nimport json\npath = Path(\"high_score.json\")\nif path.exists():\n    high_score = json.loads(path.read_text())\nelse:\n    high_score = 0"
       ]
      },
      "c": "from pathlib import Path\nimport json\npath = Path(\"high_score.json\")\nif path.exists():\n    high_score = json.loads(path.read_text())\nelse:\n    high_score = 0",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^import\\s+json\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^if\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\.\\w+\\(\\)\\s*\\)$",
       "^else\\s*:$",
       "^\\w+\\s*=\\s*0$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-6",
    "t": "Refactoring",
    "orig": "Refactoring",
    "lvl": 2,
    "tr": "Look for methods that are doing more than one task, and refactor them to organize the code. For example, move part of the code in <code>_check_bullet_alien_collisions()</code> into a <code>_start_new_level()</code> function. Also move the four method calls in the Scoreboard's <code>__init__()</code> into a <code>prep_images()</code> method.",
    "steps": [
     {
      "f": "Extract the {{_start_new_level}} method.",
      "k": {
       "_start_new_level": [
        "The new method should include creating the fleet and increasing the speed.",
        "def _start_new_level(self):\n    self.bullets.empty()\n    self._create_fleet()\n    self.settings.increase_speed()\n    self.stats.level += 1\n    self.sb.prep_level()"
       ]
      },
      "c": "def _start_new_level(self):\n    self.bullets.empty()\n    self._create_fleet()\n    self.settings.increase_speed()\n    self.stats.level += 1\n    self.sb.prep_level()",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\(\\)$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*1$",
       "^self\\.\\w+\\.\\w+\\(\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-7",
    "t": "Expanding the Game",
    "orig": "Expanding the Game",
    "lvl": 3,
    "tr": "Think of a way to expand Alien Invasion. For example, program the aliens to fire bullets at the ship, or add shields to hide behind. Describe your idea and write a piece of code.",
    "steps": [
     {
      "f": "Describe your {{expansion}}.",
      "k": {
       "expansion": [
        "Write the logic you want to add.",
        "e.g. \"I add a Shield class with a hits_left attribute\""
       ]
      },
      "c": null,
      "ta": "Describe the expansion and how you would implement it (min 20 characters)…",
      "min": 20
     },
     {
      "f": "Write a {{fragment}} of code to get started.",
      "k": {
       "fragment": [
        "A piece of code that shows your idea.",
        "class Shield:\n    def __init__(self):\n        self.hits_left = 3"
       ]
      },
      "c": "class Shield:\n    def __init__(self):\n        self.hits_left = 3",
      "re": [
       "^class\\s+\\w+\\s*:$",
       "^def\\s+__init__\\(\\s*self\\s*\\)\\s*:$",
       "^self\\.\\w+\\s*=\\s*\\d+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   },
   {
    "id": "14-8",
    "t": "Sideways Shooter, Final Version",
    "orig": "Sideways Shooter, Final Version",
    "lvl": 3,
    "tr": "Keep building on Sideways Shooter, using everything you've made in this project. Add a Play button, make the game speed up at appropriate points, and develop a scoring system.",
    "steps": [
     {
      "f": "Integrate {{Play}} and {{score}} into the game.",
      "k": {
       "Play": [
        "Add the Button class and the _check_play_button method.",
        "self.play_button = Button(self, \"Play\")"
       ],
       "score": [
        "Add the Scoreboard class and the scoring logic.",
        "self.stats.score += 10"
       ]
      },
      "c": "self.play_button = Button(self, \"Play\")\nself.stats.score += 10",
      "re": [
       "^self\\.\\w+\\s*=\\s*\\w+\\(\\s*self\\s*,\\s*[\"']Play[\"']\\s*\\)$",
       "^self\\.\\w+\\.\\w+\\s*\\+=\\s*\\d+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "ch": 14
   }
  ]
 },
 {
  "n": 15,
  "t": "Generating Data",
  "sub": "Charts with Matplotlib and interactive visualizations with Plotly",
  "concepts": [
   "Installing Matplotlib and Plotly",
   "plt.subplots() and ax.plot()",
   "Customizing titles, axes, and styles",
   "Scatter plots",
   "The RandomWalk class",
   "Histograms with Plotly"
  ],
  "ex": [
   {
    "id": "15-1",
    "t": "Cubes",
    "orig": "Cubes",
    "lvl": 1,
    "tr": "A number raised to the third power is a cube. Plot the first five cubic numbers, then the first 5,000. (Note: run locally to see the chart).",
    "steps": [
     {
      "f": "Generate the first 5 cubes with a {{list comprehension}}.",
      "k": {
       "list comprehension": [
        "Cube each number with <code>** 3</code>.",
        "cubi = [x**3 for x in range(1, 6)]"
       ]
      },
      "c": "cubi = [x**3 for x in range(1, 6)]",
      "re": "^\\w+\\s*=\\s*\\[\\s*\\w+\\s*\\*\\*\\s*3\\s+for\\s+\\w+\\s+in\\s+range\\(\\s*1\\s*,\\s*6\\s*\\)\\s*\\]$"
     },
     {
      "f": "Generate the first 5,000 cubes and {{trace}} the chart.",
      "k": {
       "trace": [
        "Switch to Matplotlib for the plot.",
        "import matplotlib.pyplot as plt\nx_values = range(1, 5001)\ny_values = [x**3 for x in x_values]\nplt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.scatter(x_values, y_values, s=10)\nplt.show()"
       ]
      },
      "c": "import matplotlib.pyplot as plt\nx_values = range(1, 5001)\ny_values = [x**3 for x in x_values]\nplt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.scatter(x_values, y_values, s=10)\nplt.show()",
      "re": [
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt\\s*$",
       "^\\w+\\s*=\\s*range\\(\\s*1\\s*,\\s*5001\\s*\\)$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\s*\\*\\*\\s*3\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$",
       "^plt\\.style\\.use\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*,\\s*\\w+\\s*=\\s*plt\\.subplots\\(\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*s\\s*=\\s*\\d+\\s*\\)$",
       "^plt\\.show\\(\\)\\s*$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-2",
    "t": "Colored Cubes",
    "orig": "Colored Cubes",
    "lvl": 2,
    "tr": "Apply a colormap to the cubes plot.",
    "steps": [
     {
      "f": "Add the {{colormap}} to the scatter plot.",
      "k": {
       "colormap": [
        "Use the c and cmap arguments.",
        "ax.scatter(x_values, y_values, c=y_values, cmap=plt.cm.Blues, s=10)"
       ]
      },
      "c": "ax.scatter(x_values, y_values, c=y_values, cmap=plt.cm.Blues, s=10)",
      "re": "^\\w+\\.\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*c\\s*=\\s*\\w+\\s*,\\s*cmap\\s*=\\s*plt\\.cm\\.\\w+\\s*,\\s*s\\s*=\\s*\\d+\\s*\\)$",
      "btn": "✓ Ran locally"
     }
    ],
    "prereq": "15-1",
    "ch": 15
   },
   {
    "id": "15-3",
    "t": "Molecular Motion",
    "orig": "Molecular Motion",
    "lvl": 2,
    "tr": "Modify rw_visual.py by replacing ax.scatter() with ax.plot(). To simulate the path of a grain of pollen, pass rw.x_values and rw.y_values, and include a linewidth argument. Use 5,000 points instead of 50,000.",
    "steps": [
     {
      "f": "Import matplotlib and the {{RandomWalk}} class.",
      "k": {
       "RandomWalk": [
        "The RandomWalk class comes from the chapter's random_walk module.",
        "import matplotlib.pyplot as plt\nfrom random_walk import RandomWalk"
       ]
      },
      "c": "import matplotlib.pyplot as plt\nfrom random_walk import RandomWalk",
      "re": [
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt\\s*$",
       "^from\\s+random_walk\\s+import\\s+RandomWalk\\s*$"
      ]
     },
     {
      "f": "Create the {{thousand}}-point path and fill it.",
      "k": {
       "thousand": [
        "Create a RandomWalk instance with 5_000 points and call fill_walk().",
        "rw = RandomWalk(5_000)\nrw.fill_walk()"
       ]
      },
      "c": "rw = RandomWalk(5_000)\nrw.fill_walk()",
      "re": [
       "^\\w+\\s*=\\s*RandomWalk\\(\\s*\\d[\\d_]*\\s*\\)$",
       "^\\w+\\.fill_walk\\(\\)\\s*$"
      ]
     },
     {
      "f": "Draw the {{path}} with ax.plot() instead of ax.scatter().",
      "k": {
       "path": [
        "The line shows the continuous path: pass rw.x_values and rw.y_values with linewidth.",
        "fig, ax = plt.subplots()\nax.plot(rw.x_values, rw.y_values, linewidth=1)\nplt.show()"
       ]
      },
      "c": "fig, ax = plt.subplots()\nax.plot(rw.x_values, rw.y_values, linewidth=1)\nplt.show()",
      "re": [
       "^\\w+\\s*,\\s*\\w+\\s*=\\s*plt\\.subplots\\(\\)\\s*$",
       "^\\w+\\.plot\\(\\s*\\w+\\.\\w+\\s*,\\s*\\w+\\.\\w+\\s*,\\s*linewidth\\s*=\\s*\\d+\\s*\\)$",
       "^plt\\.show\\(\\)\\s*$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-4",
    "t": "Modified Random Walks",
    "orig": "Modified Random Walks",
    "lvl": 2,
    "tr": "In the RandomWalk class, x_step and y_step are generated from the same set of conditions. Modify the values in these lists to see what happens to the overall shape of the walks.",
    "steps": [
     {
      "f": "Modify the list of {{distances}}.",
      "k": {
       "distances": [
        "Try a longer range, e.g. from 0 to 8.",
        "x_distance = choice([0, 1, 2, 3, 4, 5, 6, 7, 8])"
       ]
      },
      "c": "x_distance = choice([0, 1, 2, 3, 4, 5, 6, 7, 8])",
      "re": "^\\w+\\s*=\\s*choice\\(\\s*\\[\\s*0\\s*,\\s*1\\s*,\\s*2\\s*,\\s*3\\s*,\\s*4\\s*,\\s*5\\s*,\\s*6\\s*,\\s*7\\s*,\\s*8\\s*\\]\\s*\\)$",
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-5",
    "t": "Refactoring (RandomWalk)",
    "orig": "Refactoring (RandomWalk)",
    "lvl": 3,
    "tr": "The fill_walk() method is lengthy. Create a new <code>get_step()</code> method to determine the direction and distance for each step. You should end up with two calls to get_step() in fill_walk().",
    "steps": [
     {
      "f": "Extract the {{get_step}} method.",
      "k": {
       "get_step": [
        "Returns the sum of direction and distance.",
        "def get_step(self):\n    direction = choice([1, -1])\n    distance = choice([0, 1, 2, 3, 4])\n    return direction * distance"
       ]
      },
      "c": "def get_step(self):\n    direction = choice([1, -1])\n    distance = choice([0, 1, 2, 3, 4])\n    return direction * distance",
      "re": [
       "^def\\s+\\w+\\(\\s*self\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*choice\\(\\s*\\[\\s*1\\s*,\\s*-1\\s*\\]\\s*\\)$",
       "^\\w+\\s*=\\s*choice\\(\\s*\\[\\s*0\\s*,\\s*1\\s*,\\s*2\\s*,\\s*3\\s*,\\s*4\\s*\\]\\s*\\)$",
       "^return\\s+\\w+\\s*\\*\\s*\\w+$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Use {{get_step}} in fill_walk().",
      "k": {
       "get_step": [
        "Replace the code block with two calls.",
        "x_step = self.get_step()\ny_step = self.get_step()"
       ]
      },
      "c": "x_step = self.get_step()\ny_step = self.get_step()",
      "re": [
       "^\\w+\\s*=\\s*self\\.\\w+\\(\\)$",
       "^\\w+\\s*=\\s*self\\.\\w+\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-6",
    "t": "Two D8s",
    "orig": "Two D8s",
    "lvl": 2,
    "tr": "Make a simulation that shows what happens when you roll two eight-sided dice 1,000 times. Gradually increase the number of rolls.",
    "steps": [
     {
      "f": "Create two {{istanze}} of Die(8).",
      "k": {
       "istanze": [
        "Import Die from die.py and create two 8-sided dice; then roll 1,000 times and add the results.",
        "from die import Die\ndie_1 = Die(8)\ndie_2 = Die(8)\nresults = []\nfor roll_num in range(1000):\n    result = die_1.roll() + die_2.roll()\n    results.append(result)"
       ]
      },
      "c": "from die import Die\ndie_1 = Die(8)\ndie_2 = Die(8)\nresults = []\nfor roll_num in range(1000):\n    result = die_1.roll() + die_2.roll()\n    results.append(result)",
      "re": [
       "^from\\s+die\\s+import\\s+Die$",
       "^\\w+\\s*=\\s*Die\\(\\s*8\\s*\\)$",
       "^\\w+\\s*=\\s*Die\\(\\s*8\\s*\\)$",
       "^\\w+\\s*=\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\d+\\):$",
       "^\\w+\\s*=\\s*\\w+\\.roll\\(\\)\\s*\\+\\s*\\w+\\.roll\\(\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Analyze the {{frequencies}} of each result.",
      "k": {
       "frequencies": [
        "The maximum result is the sum of the sides; count how many times each value comes up with results.count().",
        "frequencies = []\nmax_result = die_1.num_sides + die_2.num_sides\nposs_results = range(2, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)"
       ]
      },
      "c": "frequencies = []\nmax_result = die_1.num_sides + die_2.num_sides\nposs_results = range(2, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\]$",
       "^\\w+\\s*=\\s*\\w+\\.num_sides\\s*\\+\\s*\\w+\\.num_sides$",
       "^\\w+\\s*=\\s*range\\(\\s*\\d+\\s*,\\s*\\w+\\s*\\+\\s*\\d+\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\.count\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Visualize the frequencies with a {{bars}} chart.",
      "k": {
       "bars": [
        "Import plotly.express and build px.bar() with poss_results and frequencies; xaxis_dtick=1 shows every value.",
        "import plotly.express as px\ntitle = \"Results of Rolling Two D8s 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()"
       ]
      },
      "c": "import plotly.express as px\ntitle = \"Results of Rolling Two D8s 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()",
      "re": [
       "^import\\s+plotly\\.express\\s+as\\s+px$",
       "^\\w+\\s*=\\s*[\"'].+[\"']$",
       "^\\w+\\s*=\\s*\\{.*\\}$",
       "^\\w+\\s*=\\s*px\\.bar\\(.*\\)$",
       "^\\w+\\.update_layout\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-7",
    "t": "Three Dice",
    "orig": "Three Dice",
    "lvl": 2,
    "tr": "When you roll three D6 dice, the smallest number is 3 and the largest is 18. Make a visualization that shows what happens.",
    "steps": [
     {
      "f": "Import the {{Die}} class and create three dice.",
      "k": {
       "Die": [
        "Three standard D6s: die_1, die_2, die_3.",
        "from die import Die\ndie_1 = Die()\ndie_2 = Die()\ndie_3 = Die()"
       ]
      },
      "c": "from die import Die\ndie_1 = Die()\ndie_2 = Die()\ndie_3 = Die()",
      "re": [
       "^from\\s+die\\s+import\\s+Die$",
       "^\\w+\\s*=\\s*Die\\(\\)$",
       "^\\w+\\s*=\\s*Die\\(\\)$",
       "^\\w+\\s*=\\s*Die\\(\\)$"
      ]
     },
     {
      "f": "Simulate the {{lanci}} by adding up the three dice.",
      "k": {
       "lanci": [
        "1,000 rolls: the sum of the three roll() calls goes into results.",
        "results = []\nfor roll_num in range(1000):\n    result = die_1.roll() + die_2.roll() + die_3.roll()\n    results.append(result)"
       ]
      },
      "c": "results = []\nfor roll_num in range(1000):\n    result = die_1.roll() + die_2.roll() + die_3.roll()\n    results.append(result)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\d+\\):$",
       "^\\w+\\s*=\\s*\\w+\\.roll\\(\\)\\s*\\+\\s*\\w+\\.roll\\(\\)\\s*\\+\\s*\\w+\\.roll\\(\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Count the {{frequencies}} of each result.",
      "k": {
       "frequencies": [
        "The minimum is 3 (three ones); the maximum is the sum of the sides.",
        "frequencies = []\nmax_result = die_1.num_sides + die_2.num_sides + die_3.num_sides\nposs_results = range(3, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)"
       ]
      },
      "c": "frequencies = []\nmax_result = die_1.num_sides + die_2.num_sides + die_3.num_sides\nposs_results = range(3, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\]$",
       "^\\w+\\s*=\\s*\\w+\\.num_sides\\s*\\+\\s*\\w+\\.num_sides\\s*\\+\\s*\\w+\\.num_sides$",
       "^\\w+\\s*=\\s*range\\(\\s*\\d+\\s*,\\s*\\w+\\s*\\+\\s*\\d+\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\.count\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Visualize with a {{bars}} chart.",
      "k": {
       "bars": [
        "px.bar() with poss_results and frequencies, then update_layout(xaxis_dtick=1) and show().",
        "import plotly.express as px\ntitle = \"Results of Rolling Three D6s 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()"
       ]
      },
      "c": "import plotly.express as px\ntitle = \"Results of Rolling Three D6s 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()",
      "re": [
       "^import\\s+plotly\\.express\\s+as\\s+px$",
       "^\\w+\\s*=\\s*[\"'].+[\"']$",
       "^\\w+\\s*=\\s*\\{.*\\}$",
       "^\\w+\\s*=\\s*px\\.bar\\(.*\\)$",
       "^\\w+\\.update_layout\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-8",
    "t": "Multiplication",
    "orig": "Multiplication",
    "lvl": 2,
    "tr": "When you roll two dice, you usually add the two numbers. Make a visualization that shows what happens if you multiply them instead.",
    "steps": [
     {
      "f": "Create two dice and try the {{multiplication}} with one roll.",
      "k": {
       "multiplication": [
        "Import Die, create two D6s, and print the product of one roll to see how it works.",
        "from die import Die\ndie_1 = Die()\ndie_2 = Die()\nresult = die_1.roll() * die_2.roll()\nprint(result)"
       ]
      },
      "c": "from die import Die\ndie_1 = Die()\ndie_2 = Die()\nresult = die_1.roll() * die_2.roll()\nprint(result)",
      "re": [
       "^from\\s+die\\s+import\\s+Die$",
       "^\\w+\\s*=\\s*Die\\(\\)$",
       "^\\w+\\s*=\\s*Die\\(\\)$",
       "^\\w+\\s*=\\s*\\w+\\.roll\\(\\)\\s*\\*\\s*\\w+\\.roll\\(\\)$",
       "^print\\(\\w+\\)$"
      ]
     },
     {
      "f": "Repeat the rolls many {{times}} and save the products.",
      "k": {
       "times": [
        "1,000 rolls: each time, the product of the two roll() calls goes into results.",
        "results = []\nfor roll_num in range(1000):\n    result = die_1.roll() * die_2.roll()\n    results.append(result)"
       ]
      },
      "c": "results = []\nfor roll_num in range(1000):\n    result = die_1.roll() * die_2.roll()\n    results.append(result)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+range\\(\\d+\\):$",
       "^\\w+\\s*=\\s*\\w+\\.roll\\(\\)\\s*\\*\\s*\\w+\\.roll\\(\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Count the {{frequencies}} of each product.",
      "k": {
       "frequencies": [
        "Here the maximum is NOT a sum: it's the product of the sides (36).",
        "frequencies = []\nmax_result = die_1.num_sides * die_2.num_sides\nposs_results = range(1, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)"
       ]
      },
      "c": "frequencies = []\nmax_result = die_1.num_sides * die_2.num_sides\nposs_results = range(1, max_result + 1)\nfor value in poss_results:\n    frequency = results.count(value)\n    frequencies.append(frequency)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\]$",
       "^\\w+\\s*=\\s*\\w+\\.num_sides\\s*\\*\\s*\\w+\\.num_sides$",
       "^\\w+\\s*=\\s*range\\(\\s*\\d+\\s*,\\s*\\w+\\s*\\+\\s*\\d+\\s*\\)$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\.count\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Visualize the frequencies with a {{bars}} chart.",
      "k": {
       "bars": [
        "px.bar() like in the other dice exercises.",
        "import plotly.express as px\ntitle = \"Multiplication Results for Two D6s, 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()"
       ]
      },
      "c": "import plotly.express as px\ntitle = \"Multiplication Results for Two D6s, 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()",
      "re": [
       "^import\\s+plotly\\.express\\s+as\\s+px$",
       "^\\w+\\s*=\\s*[\"'].+[\"']$",
       "^\\w+\\s*=\\s*\\{.*\\}$",
       "^\\w+\\s*=\\s*px\\.bar\\(.*\\)$",
       "^\\w+\\.update_layout\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-9",
    "t": "Die Comprehensions",
    "orig": "Die Comprehensions",
    "lvl": 3,
    "tr": "For clarity, the examples in this section use the long form of for loops. If you're comfortable with list comprehensions, try writing one for one or both of the loops.",
    "steps": [
     {
      "f": "Create a die and rewrite the loop as a list {{comprehension}}.",
      "k": {
       "comprehension": [
        "In one line: results = [die.roll() for _ in range(1000)].",
        "from die import Die\ndie = Die()\nresults = [die.roll() for _ in range(1000)]"
       ]
      },
      "c": "from die import Die\ndie = Die()\nresults = [die.roll() for _ in range(1000)]",
      "re": [
       "^from\\s+die\\s+import\\s+Die$",
       "^\\w+\\s*=\\s*Die\\(\\)$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\.roll\\(\\)\\s+for\\s+_\\s+in\\s+range\\(\\d+\\)\\s*\\]$"
      ]
     },
     {
      "f": "Compute the frequencies, again with a {{comprehension}}.",
      "k": {
       "comprehension": [
        "The counting can also fit in one line: for each possible value, count it in results.",
        "poss_results = range(1, die.num_sides + 1)\nfrequencies = [results.count(value) for value in poss_results]"
       ]
      },
      "c": "poss_results = range(1, die.num_sides + 1)\nfrequencies = [results.count(value) for value in poss_results]",
      "re": [
       "^\\w+\\s*=\\s*range\\(\\s*\\d+\\s*,\\s*\\w+\\.num_sides\\s*\\+\\s*\\d+\\s*\\)$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\.count\\(\\w+\\)\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$"
      ]
     },
     {
      "f": "Visualize the frequencies with a {{bars}} chart.",
      "k": {
       "bars": [
        "px.bar() with a title and labels.",
        "import plotly.express as px\ntitle = \"Results of Rolling One D6 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()"
       ]
      },
      "c": "import plotly.express as px\ntitle = \"Results of Rolling One D6 1,000 Times\"\nlabels = {'x': 'Result', 'y': 'Frequency of Result'}\nfig = px.bar(x=poss_results, y=frequencies, title=title, labels=labels)\nfig.update_layout(xaxis_dtick=1)\nfig.show()",
      "re": [
       "^import\\s+plotly\\.express\\s+as\\s+px$",
       "^\\w+\\s*=\\s*[\"'].+[\"']$",
       "^\\w+\\s*=\\s*\\{.*\\}$",
       "^\\w+\\s*=\\s*px\\.bar\\(.*\\)$",
       "^\\w+\\.update_layout\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 15
   },
   {
    "id": "15-10",
    "t": "Practicing with Both Libraries",
    "orig": "Practicing with Both Libraries",
    "lvl": 3,
    "tr": "Try using Matplotlib to make a visualization of the dice rolls, and Plotly to make the random walk visualization. The <code>die.py</code> module (the Die class) is already in the runtime: import it, don't rewrite it.",
    "steps": [
     {
      "f": "Create the die and simulate the {{lanci}}.",
      "k": {
       "lanci": [
        "As in the previous exercises: build the results list and compute the frequencies.",
        "from die import Die\ndie = Die()\nresults = [die.roll() for _ in range(1000)]\nposs_results = range(1, die.num_sides + 1)\nfrequencies = [results.count(value) for value in poss_results]"
       ]
      },
      "c": "from die import Die\ndie = Die()\nresults = [die.roll() for _ in range(1000)]\nposs_results = range(1, die.num_sides + 1)\nfrequencies = [results.count(value) for value in poss_results]",
      "re": [
       "^from\\s+die\\s+import\\s+Die\\s*$",
       "^\\w+\\s*=\\s*Die\\(\\)\\s*$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\.\\w+\\(\\)\\s+for\\s+\\w+\\s+in\\s+range\\(\\s*1000\\s*\\)\\s*\\]$",
       "^\\w+\\s*=\\s*range\\(\\s*1\\s*,\\s*\\w+\\.\\w+\\s*\\+\\s*1\\s*\\)$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Draw the dice {{grafico}} with Matplotlib.",
      "k": {
       "grafico": [
        "Use plt.bar() for the results.",
        "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.bar(poss_results, frequencies)\nplt.show()"
       ]
      },
      "c": "import matplotlib.pyplot as plt\nfig, ax = plt.subplots()\nax.bar(poss_results, frequencies)\nplt.show()",
      "re": [
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt\\s*$",
       "^\\w+\\s*,\\s*\\w+\\s*=\\s*plt\\.subplots\\(\\)$",
       "^\\w+\\.\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
       "^plt\\.show\\(\\)\\s*$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "virtualFiles": {
     "die.py": "from random import randint\n\nclass Die:\n    \"\"\"A die with N sides.\"\"\"\n\n    def __init__(self, num_sides=6):\n        self.num_sides = num_sides\n\n    def roll(self):\n        \"\"\"Return a random value between 1 and the number of sides.\"\"\"\n        return randint(1, self.num_sides)\n"
    },
    "ch": 15
   }
  ]
 },
 {
  "n": 16,
  "t": "Downloading Data",
  "sub": "CSV, datetime, GeoJSON, and interactive maps",
  "concepts": [
   "The csv module",
   "The datetime module and strptime",
   "Handling missing data with try-except",
   "GeoJSON and Plotly scatter_geo",
   "Interactive maps with hover"
  ],
  "ex": [
   {
    "id": "16-1",
    "t": "Sitka Rainfall",
    "orig": "Sitka Rainfall",
    "lvl": 2,
    "tr": "Sitka is in a temperate rainforest, so it receives a lot of rain. The file <code>sitka_weather_2021_full.csv</code> has a header called <code>PRCP</code>, which represents the daily rainfall. Make a visualization focused on that column.",
    "steps": [
     {
      "f": "Import the {{modules}} you need: Path, csv, datetime, and matplotlib.",
      "k": {
       "modules": [
        "You need pathlib for files, csv to read the tables, datetime for the dates, and matplotlib.pyplot for the plot.",
        "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt"
       ]
      },
      "c": "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+csv$",
       "^from\\s+datetime\\s+import\\s+datetime$",
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt$"
      ]
     },
     {
      "f": "Open the {{file}} with Sitka's weather data.",
      "k": {
       "file": [
        "The full file is called sitka_weather_2021_full.csv and it lives in the weather_data folder.",
        "path = Path('weather_data/sitka_weather_2021_full.csv')\nlines = path.read_text().splitlines()"
       ]
      },
      "c": "path = Path('weather_data/sitka_weather_2021_full.csv')\nlines = path.read_text().splitlines()",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']weather_data/sitka_weather_2021_full\\.csv[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)\\.splitlines\\(\\)$"
      ]
     },
     {
      "f": "Create the {{reader}} and skip the header row.",
      "k": {
       "reader": [
        "csv.reader() walks the lines; next() consumes the first one, the one with the column names.",
        "reader = csv.reader(lines)\nheader_row = next(reader)"
       ]
      },
      "c": "reader = csv.reader(lines)\nheader_row = next(reader)",
      "re": [
       "^\\w+\\s*=\\s*csv\\.reader\\(\\s*\\w+\\s*\\)$",
       "^\\w+\\s*=\\s*next\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Find the index of the {{PRCP}} column in the header.",
      "k": {
       "PRCP": [
        "Loop through the header with enumerate() and print the indexes: you're looking for where PRCP appears.",
        "for i, col in enumerate(header_row):\n    if col == \"PRCP\":\n        print(i, col)"
       ]
      },
      "c": "for i, col in enumerate(header_row):\n    if col == \"PRCP\":\n        print(i, col)",
      "re": [
       "^for\\s+\\w+\\s*,\\s+\\w+\\s+in\\s+enumerate\\(\\w+\\):$",
       "^if\\s+\\w+\\s*==\\s*[\"']PRCP[\"']\\s*:$",
       "^print\\(\\w+\\s*,\\s*\\w+\\)$"
      ],
      "so": [
       "5 PRCP"
      ]
     },
     {
      "f": "Extract the {{date}} and rainfall values into two lists.",
      "k": {
       "date": [
        "For each row, convert the date (column 2) with strptime and the rainfall (column 5) with float.",
        "dates, precips = [], []\nfor row in reader:\n    current_date = datetime.strptime(row[2], '%Y-%m-%d')\n    precip = float(row[5])\n    dates.append(current_date)\n    precips.append(precip)"
       ]
      },
      "c": "dates, precips = [], []\nfor row in reader:\n    current_date = datetime.strptime(row[2], '%Y-%m-%d')\n    precip = float(row[5])\n    dates.append(current_date)\n    precips.append(precip)",
      "re": [
       "^\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\.strptime\\(\\s*\\w+\\[\\d+\\]\\s*,\\s*[\"']%Y-%m-%d[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*float\\(\\w+\\[\\d+\\]\\)$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Draw a bar {{chart}} of the precipitation.",
      "k": {
       "chart": [
        "With the seaborn-v0_8 style, ax.bar() with the dates on the x-axis and the rainfall on the y-axis.",
        "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.bar(dates, precips, color='blue')"
       ]
      },
      "c": "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.bar(dates, precips, color='blue')",
      "re": [
       "^plt\\.style\\.use\\(\\s*[\"']seaborn-v0_8[\"']\\s*\\)$",
       "^fig\\s*,\\s*ax\\s*=\\s*plt\\.subplots\\(\\)$",
       "^ax\\.bar\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*color\\s*=\\s*[\"']\\w+[\"']\\s*\\)$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Add a {{title}} and labels, then show the plot.",
      "k": {
       "title": [
        "Set the title and y-axis label with set_title/set_ylabel; fig.autofmt_xdate() tilts the dates; plt.show() draws the plot.",
        "ax.set_title(\"Daily rainfall, 2021\", fontsize=24)\nax.set_xlabel('', fontsize=16)\nfig.autofmt_xdate()\nax.set_ylabel(\"Precipitation (inches)\", fontsize=16)\nax.tick_params(labelsize=16)\nplt.show()"
       ]
      },
      "c": "ax.set_title(\"Daily rainfall, 2021\", fontsize=24)\nax.set_xlabel('', fontsize=16)\nfig.autofmt_xdate()\nax.set_ylabel(\"Precipitation (inches)\", fontsize=16)\nax.tick_params(labelsize=16)\nplt.show()",
      "re": [
       "^ax\\.set_title\\(\\s*[\"\\'].+[\"\\']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^ax\\.set_xlabel\\(\\s*[\"\\'].*[\"\\']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^fig\\.autofmt_xdate\\(\\)$",
       "^ax\\.set_ylabel\\(\\s*[\"\\'].+[\"\\']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^ax\\.tick_params\\(.*\\)$",
       "^plt\\.show\\(\\)$"
      ]
     }
    ],
    "ch": 16
   },
   {
    "id": "16-2",
    "t": "Sitka-Death Valley Comparison",
    "orig": "Sitka-Death Valley Comparison",
    "lvl": 3,
    "tr": "The temperature scales on the Sitka and Death Valley plots reflect the different data ranges. To compare the ranges accurately, you need identical scales on the y-axis. Change the y-axis settings on one or both plots.",
    "steps": [
     {
      "f": "Import the {{modules}}: Path, csv, datetime, and matplotlib.",
      "k": {
       "modules": [
        "These are the same modules used for the Sitka and Death Valley plots.",
        "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt"
       ]
      },
      "c": "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+csv$",
       "^from\\s+datetime\\s+import\\s+datetime$",
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt$"
      ]
     },
     {
      "f": "Define the {{function}} get_weather_data() that reads a weather file.",
      "k": {
       "function": [
        "The function takes the path, the lists to fill in, and the column indexes: that way it works for any station.",
        "def get_weather_data(path, dates, highs, lows, date_index, high_index, low_index):\n    \"\"\"Extract the highs and lows from the data file.\"\"\"\n    lines = path.read_text().splitlines()\n    reader = csv.reader(lines)\n    header_row = next(reader)"
       ]
      },
      "c": "def get_weather_data(path, dates, highs, lows, date_index, high_index, low_index):\n    \"\"\"Extract the highs and lows from the data file.\"\"\"\n    lines = path.read_text().splitlines()\n    reader = csv.reader(lines)\n    header_row = next(reader)",
      "re": [
       "^def\\s+get_weather_data\\(\\s*\\w+.*\\):$",
       "^\"\"\".*\"\"\"$",
       "^lines\\s*=\\s*\\w+\\.read_text\\(\\)\\.splitlines\\(\\)$",
       "^reader\\s*=\\s*csv\\.reader\\(\\w+\\)$",
       "^\\w+\\s*=\\s*next\\(\\w+\\)$"
      ]
     },
     {
      "f": "Inside the function body, {{extract}} the dates, highs, and lows row by row.",
      "k": {
       "extract": [
        "Convert the date with strptime; int() can fail if a value is missing: protect it with try/except.",
        "    for row in reader:\n        current_date = datetime.strptime(row[date_index], '%Y-%m-%d')\n        try:\n            high = int(row[high_index])\n            low = int(row[low_index])\n        except ValueError:\n            print(f\"Missing data for {current_date}\")\n        else:\n            dates.append(current_date)\n            highs.append(high)\n            lows.append(low)"
       ]
      },
      "c": "    for row in reader:\n        current_date = datetime.strptime(row[date_index], '%Y-%m-%d')\n        try:\n            high = int(row[high_index])\n            low = int(row[low_index])\n        except ValueError:\n            print(f\"Missing data for {current_date}\")\n        else:\n            dates.append(current_date)\n            highs.append(high)\n            lows.append(low)",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\.strptime\\(\\w+\\[\\w+\\],\\s*[\"\\']%Y-%m-%d[\"\\']\\)$",
       "^try:$",
       "^\\w+\\s*=\\s*int\\(\\w+\\[\\w+\\]\\)$",
       "^\\w+\\s*=\\s*int\\(\\w+\\[\\w+\\]\\)$",
       "^except\\s+ValueError:$",
       "^print\\(.*\\)$",
       "^else:$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Read the {{Sitka}} data (dates in column 2, highs in 4, lows in 5).",
      "k": {
       "Sitka": [
        "Create the empty lists and call get_weather_data with the right indexes for sitka_weather_2021_simple.csv.",
        "path = Path('weather_data/sitka_weather_2021_simple.csv')\ndates, highs, lows = [], [], []\nget_weather_data(path, dates, highs, lows, date_index=2, high_index=4, low_index=5)"
       ]
      },
      "c": "path = Path('weather_data/sitka_weather_2021_simple.csv')\ndates, highs, lows = [], [], []\nget_weather_data(path, dates, highs, lows, date_index=2, high_index=4, low_index=5)",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']weather_data/sitka_weather_2021_simple\\.csv[\"']\\s*\\)$",
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$",
       "^get_weather_data\\(.*\\)$"
      ]
     },
     {
      "f": "Plot {{Sitka}}: the highs, lows, and the area between them.",
      "k": {
       "Sitka": [
        "plot() for the highs and lows at full alpha, and fill_between() to fill the space between them.",
        "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red', alpha=0.6)\nax.plot(dates, lows, color='blue', alpha=0.6)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.15)"
       ]
      },
      "c": "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red', alpha=0.6)\nax.plot(dates, lows, color='blue', alpha=0.6)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.15)",
      "re": [
       "^plt\\.style\\.use\\(\\s*[\"']seaborn-v0_8[\"']\\s*\\)$",
       "^fig\\s*,\\s*ax\\s*=\\s*plt\\.subplots\\(\\)$",
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.fill_between\\(.*\\)$"
      ]
     },
     {
      "f": "Read the {{Death Valley}} data (highs in column 3, lows in 4).",
      "k": {
       "Death Valley": [
        "Same procedure: the death_valley_2021_simple.csv file has its columns in a different order, so the indexes are different.",
        "path = Path('weather_data/death_valley_2021_simple.csv')\ndates, highs, lows = [], [], []\nget_weather_data(path, dates, highs, lows, date_index=2, high_index=3, low_index=4)"
       ]
      },
      "c": "path = Path('weather_data/death_valley_2021_simple.csv')\ndates, highs, lows = [], [], []\nget_weather_data(path, dates, highs, lows, date_index=2, high_index=3, low_index=4)",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']weather_data/death_valley_2021_simple\\.csv[\"']\\s*\\)$",
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$",
       "^get_weather_data\\(.*\\)$"
      ]
     },
     {
      "f": "Add {{Death Valley}} to the same plot with reduced alpha.",
      "k": {
       "Death Valley": [
        "The same three calls as before, but with lower alpha (0.3 and 0.05) to tell the two stations apart.",
        "ax.plot(dates, highs, color='red', alpha=0.3)\nax.plot(dates, lows, color='blue', alpha=0.3)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.05)"
       ]
      },
      "c": "ax.plot(dates, highs, color='red', alpha=0.3)\nax.plot(dates, lows, color='blue', alpha=0.3)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.05)",
      "re": [
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.fill_between\\(.*\\)$"
      ]
     },
     {
      "f": "Write the plot's {{title}} and labels.",
      "k": {
       "title": [
        "The title goes on two lines (the second with the two locations); then the y-axis label and tick_params.",
        "title = \"Daily high and low temperatures - 2021\"\ntitle += \"\\nSitka, AK and Death Valley, CA\"\nax.set_title(title, fontsize=24)\nax.set_xlabel('', fontsize=16)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=16)\nax.tick_params(labelsize=16)"
       ]
      },
      "c": "title = \"Daily high and low temperatures - 2021\"\ntitle += \"\\nSitka, AK and Death Valley, CA\"\nax.set_title(title, fontsize=24)\nax.set_xlabel('', fontsize=16)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=16)\nax.tick_params(labelsize=16)",
      "re": [
       "^\\w+\\s*=\\s*[\"\\'].+[\"\\']$",
       "^\\w+\\s*\\+=\\s*[\"\\']\\\\n.+[\"\\']$",
       "^ax\\.set_title\\(\\s*\\w+\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^ax\\.set_xlabel\\(\\s*[\"\\'].*[\"\\']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^fig\\.autofmt_xdate\\(\\)$",
       "^ax\\.set_ylabel\\(.*\\)$",
       "^ax\\.tick_params\\(.*\\)$"
      ]
     },
     {
      "f": "Set the y-axis {{limits}} and show the plot.",
      "k": {
       "limits": [
        "With two stations on the same plot you need the same scale: set_ylim(10, 140), then plt.show().",
        "ax.set_ylim(10, 140)\nplt.show()"
       ]
      },
      "c": "ax.set_ylim(10, 140)\nplt.show()",
      "re": [
       "^ax\\.set_ylim\\(\\s*\\d+\\s*,\\s*\\d+\\s*\\)$",
       "^plt\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 16
   },
   {
    "id": "16-3",
    "t": "San Francisco",
    "orig": "San Francisco",
    "lvl": 2,
    "tr": "Are San Francisco's temperatures more like Sitka's, or more like Death Valley's? Download some data for San Francisco and generate a plot. On the tutor a copy of the 2021 CSV is already in the runtime: press \"▶ run and check\" to see the plot and compare it with the Sitka and Death Valley ones.",
    "steps": [
     {
      "f": "Describe which {{data}} you'll use and where you'll download it locally.",
      "k": {
       "data": [
        "From the NOAA Climate Data Online site: search for the San Francisco station and download the 2021 CSV into the weather_data folder. On the tutor there's no need to download: the file weather_data/san_francisco_2021.csv is already in the runtime.",
        "https://www.ncdc.noaa.gov/cdo-web/"
       ]
      },
      "c": null,
      "ta": "Describe how you'll download the data and which station you'll use (min 20 characters)…",
      "min": 20
     },
     {
      "f": "Write the {{skeleton}} of the visualization program.",
      "k": {
       "skeleton": [
        "Reuse the chapter's script: import Path and point to the San Francisco file. Locally the CSV has to be downloaded from NOAA into weather_data; on the tutor it's already in the runtime.",
        "from pathlib import Path\npath = Path(\"weather_data/san_francisco_2021.csv\")"
       ]
      },
      "c": "from pathlib import Path\npath = Path(\"weather_data/san_francisco_2021.csv\")",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path\\s*$",
       "^\\w+\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     },
     {
      "f": "Read the file and {{extract}} the dates, highs, and lows.",
      "k": {
       "extract": [
        "As in the chapter's script: <code>read_text().splitlines()</code>, <code>csv.reader</code>, and <code>next(reader)</code> for the header. CSV columns: DATE = 2, TMAX = 4, TMIN = 5.",
        "import csv\nfrom datetime import datetime\n\nlines = path.read_text().splitlines()\nreader = csv.reader(lines)\nheader_row = next(reader)\n\ndates, highs, lows = [], [], []\nfor row in reader:\n    current_date = datetime.strptime(row[2], \"%Y-%m-%d\")\n    dates.append(current_date)\n    highs.append(int(row[4]))\n    lows.append(int(row[5]))"
       ]
      },
      "c": "import csv\nfrom datetime import datetime\n\nlines = path.read_text().splitlines()\nreader = csv.reader(lines)\nheader_row = next(reader)\n\ndates, highs, lows = [], [], []\nfor row in reader:\n    current_date = datetime.strptime(row[2], \"%Y-%m-%d\")\n    dates.append(current_date)\n    highs.append(int(row[4]))\n    lows.append(int(row[5]))",
      "re": [
       "^import\\s+csv\\s*$",
       "^from\\s+datetime\\s+import\\s+datetime\\s*$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)\\.splitlines\\(\\)\\s*$",
       "^\\w+\\s*=\\s*csv\\.reader\\(\\s*\\w+\\s*\\)\\s*$",
       "^\\w+\\s*=\\s*next\\(\\s*\\w+\\s*\\)\\s*$",
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\s*\\]\\s*,\\s*\\[\\s*\\]\\s*,\\s*\\[\\s*\\]\\s*$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\s*:$",
       "^\\w+\\s*=\\s*datetime\\.strptime\\(\\s*\\w+\\[\\s*\\d+\\s*\\]\\s*,\\s*[\"']%Y-%m-%d[\"']\\s*\\)\\s*$",
       "^\\w+\\.append\\(\\s*\\w+\\s*\\)$",
       "^\\w+\\.append\\(\\s*int\\(\\s*\\w+\\[\\s*\\d+\\s*\\]\\s*\\)\\s*\\)\\s*$",
       "^\\w+\\.append\\(\\s*int\\(\\s*\\w+\\[\\s*\\d+\\s*\\]\\s*\\)\\s*\\)\\s*$"
      ]
     },
     {
      "f": "Draw the {{chart}} of highs and lows.",
      "k": {
       "chart": [
        "Two <code>ax.plot()</code> calls (highs in red, lows in blue), title, labels, and <code>fig.autofmt_xdate()</code> for the tilted dates, as in the chapter's script.",
        "import matplotlib.pyplot as plt\n\nplt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red')\nax.plot(dates, lows, color='blue')\nax.set_title(\"Daily temperatures 2021 - San Francisco\", fontsize=20)\nax.set_xlabel('', fontsize=14)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=14)\nplt.show()"
       ]
      },
      "c": "import matplotlib.pyplot as plt\n\nplt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red')\nax.plot(dates, lows, color='blue')\nax.set_title(\"Daily temperatures 2021 - San Francisco\", fontsize=20)\nax.set_xlabel('', fontsize=14)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=14)\nplt.show()",
      "re": [
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt\\s*$",
       "^plt\\.style\\.use\\(\\s*[\"'].+[\"']\\s*\\)\\s*$",
       "^\\w+\\s*,\\s*\\w+\\s*=\\s*plt\\.subplots\\(\\)\\s*$",
       "^\\w+\\.plot\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*color\\s*=\\s*[\"']\\w+[\"']\\s*\\)\\s*$",
       "^\\w+\\.plot\\(\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*color\\s*=\\s*[\"']\\w+[\"']\\s*\\)\\s*$",
       "^\\w+\\.set_title\\(\\s*[\"'].+[\"']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)\\s*$",
       "^\\w+\\.set_xlabel\\(\\s*[\"'][\"']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)\\s*$",
       "^\\w+\\.autofmt_xdate\\(\\)\\s*$",
       "^\\w+\\.set_ylabel\\(\\s*[\"'].+[\"']\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)\\s*$",
       "^plt\\.show\\(\\)\\s*$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "virtualFiles": {
     "weather_data/san_francisco_2021.csv": "\"STATION\",\"NAME\",\"DATE\",\"TAVG\",\"TMAX\",\"TMIN\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-01\",,\"61\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-02\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-03\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-04\",,\"57\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-05\",,\"64\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-06\",,\"56\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-07\",,\"65\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-08\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-09\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-10\",,\"67\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-11\",,\"64\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-12\",,\"58\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-13\",,\"66\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-14\",,\"64\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-15\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-16\",,\"52\",\"40\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-17\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-18\",,\"58\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-19\",,\"63\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-20\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-21\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-22\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-23\",,\"58\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-24\",,\"58\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-25\",,\"61\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-26\",,\"67\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-27\",,\"61\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-28\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-29\",,\"59\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-30\",,\"61\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-01-31\",,\"59\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-01\",,\"60\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-02\",,\"60\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-03\",,\"65\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-04\",,\"58\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-05\",,\"61\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-06\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-07\",,\"62\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-08\",,\"63\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-09\",,\"58\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-10\",,\"56\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-11\",,\"61\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-12\",,\"57\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-13\",,\"56\",\"42\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-14\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-15\",,\"63\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-16\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-17\",,\"54\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-18\",,\"62\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-19\",,\"58\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-20\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-21\",,\"54\",\"40\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-22\",,\"57\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-23\",,\"53\",\"40\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-24\",,\"56\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-25\",,\"58\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-26\",,\"56\",\"42\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-27\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-02-28\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-01\",,\"56\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-02\",,\"54\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-03\",,\"56\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-04\",,\"60\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-05\",,\"55\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-06\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-07\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-08\",,\"58\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-09\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-10\",,\"61\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-11\",,\"58\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-12\",,\"60\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-13\",,\"58\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-14\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-15\",,\"62\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-16\",,\"60\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-17\",,\"60\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-18\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-19\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-20\",,\"66\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-21\",,\"54\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-22\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-23\",,\"57\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-24\",,\"60\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-25\",,\"58\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-26\",,\"62\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-27\",,\"54\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-28\",,\"57\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-29\",,\"58\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-30\",,\"63\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-03-31\",,\"60\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-01\",,\"60\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-02\",,\"59\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-03\",,\"61\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-04\",,\"55\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-05\",,\"57\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-06\",,\"61\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-07\",,\"58\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-08\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-09\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-10\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-11\",,\"58\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-12\",,\"57\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-13\",,\"59\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-14\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-15\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-16\",,\"58\",\"44\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-17\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-18\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-19\",,\"54\",\"41\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-20\",,\"67\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-21\",,\"60\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-22\",,\"62\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-23\",,\"57\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-24\",,\"63\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-25\",,\"63\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-26\",,\"59\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-27\",,\"63\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-28\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-29\",,\"60\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-04-30\",,\"63\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-01\",,\"56\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-02\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-03\",,\"58\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-04\",,\"66\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-05\",,\"62\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-06\",,\"56\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-07\",,\"62\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-08\",,\"63\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-09\",,\"54\",\"41\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-10\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-11\",,\"56\",\"43\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-12\",,\"62\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-13\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-14\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-15\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-16\",,\"63\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-17\",,\"60\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-18\",,\"65\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-19\",,\"67\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-20\",,\"64\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-21\",,\"65\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-22\",,\"65\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-23\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-24\",,\"59\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-25\",,\"64\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-26\",,\"68\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-27\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-28\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-29\",,\"59\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-30\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-05-31\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-01\",,\"69\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-02\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-03\",,\"67\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-04\",,\"65\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-05\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-06\",,\"66\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-07\",,\"68\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-08\",,\"66\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-09\",,\"64\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-10\",,\"67\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-11\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-12\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-13\",,\"67\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-14\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-15\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-16\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-17\",,\"69\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-18\",,\"65\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-19\",,\"60\",\"46\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-20\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-21\",,\"65\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-22\",,\"71\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-23\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-24\",,\"66\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-25\",,\"67\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-26\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-27\",,\"71\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-28\",,\"70\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-29\",,\"71\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-06-30\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-01\",,\"66\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-02\",,\"64\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-03\",,\"74\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-04\",,\"66\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-05\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-06\",,\"71\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-07\",,\"71\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-08\",,\"67\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-09\",,\"64\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-10\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-11\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-12\",,\"74\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-13\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-14\",,\"76\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-15\",,\"67\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-16\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-17\",,\"71\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-18\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-19\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-20\",,\"71\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-21\",,\"71\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-22\",,\"70\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-23\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-24\",,\"72\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-25\",,\"63\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-26\",,\"73\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-27\",,\"71\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-28\",,\"69\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-29\",,\"75\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-30\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-07-31\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-01\",,\"72\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-02\",,\"73\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-03\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-04\",,\"71\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-05\",,\"78\",\"65\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-06\",,\"82\",\"68\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-07\",,\"77\",\"67\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-08\",,\"68\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-09\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-10\",,\"74\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-11\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-12\",,\"78\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-13\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-14\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-15\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-16\",,\"74\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-17\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-18\",,\"77\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-19\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-20\",,\"71\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-21\",,\"77\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-22\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-23\",,\"69\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-24\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-25\",,\"72\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-26\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-27\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-28\",,\"75\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-29\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-30\",,\"75\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-08-31\",,\"73\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-01\",,\"79\",\"68\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-02\",,\"79\",\"67\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-03\",,\"76\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-04\",,\"74\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-05\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-06\",,\"75\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-07\",,\"74\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-08\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-09\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-10\",,\"75\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-11\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-12\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-13\",,\"81\",\"68\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-14\",,\"72\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-15\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-16\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-17\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-18\",,\"77\",\"66\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-19\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-20\",,\"79\",\"66\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-21\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-22\",,\"79\",\"68\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-23\",,\"73\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-24\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-25\",,\"75\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-26\",,\"78\",\"65\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-27\",,\"74\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-28\",,\"76\",\"65\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-29\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-09-30\",,\"75\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-01\",,\"77\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-02\",,\"69\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-03\",,\"73\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-04\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-05\",,\"76\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-06\",,\"75\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-07\",,\"75\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-08\",,\"71\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-09\",,\"76\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-10\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-11\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-12\",,\"71\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-13\",,\"71\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-14\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-15\",,\"70\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-16\",,\"73\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-17\",,\"76\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-18\",,\"71\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-19\",,\"77\",\"66\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-20\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-21\",,\"71\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-22\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-23\",,\"70\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-24\",,\"72\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-25\",,\"74\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-26\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-27\",,\"72\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-28\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-29\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-30\",,\"67\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-10-31\",,\"71\",\"60\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-01\",,\"73\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-02\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-03\",,\"76\",\"64\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-04\",,\"73\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-05\",,\"68\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-06\",,\"66\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-07\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-08\",,\"69\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-09\",,\"70\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-10\",,\"62\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-11\",,\"69\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-12\",,\"74\",\"62\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-13\",,\"71\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-14\",,\"70\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-15\",,\"72\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-16\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-17\",,\"62\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-18\",,\"71\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-19\",,\"73\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-20\",,\"67\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-21\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-22\",,\"69\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-23\",,\"64\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-24\",,\"65\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-25\",,\"68\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-26\",,\"67\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-27\",,\"64\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-28\",,\"63\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-29\",,\"63\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-11-30\",,\"68\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-01\",,\"68\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-02\",,\"75\",\"63\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-03\",,\"67\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-04\",,\"70\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-05\",,\"72\",\"59\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-06\",,\"70\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-07\",,\"63\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-08\",,\"67\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-09\",,\"68\",\"58\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-10\",,\"69\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-11\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-12\",,\"65\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-13\",,\"69\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-14\",,\"74\",\"61\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-15\",,\"67\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-16\",,\"65\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-17\",,\"65\",\"54\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-18\",,\"64\",\"53\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-19\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-20\",,\"70\",\"57\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-21\",,\"60\",\"47\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-22\",,\"58\",\"45\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-23\",,\"67\",\"56\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-24\",,\"65\",\"55\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-25\",,\"63\",\"51\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-26\",,\"61\",\"49\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-27\",,\"61\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-28\",,\"58\",\"48\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-29\",,\"64\",\"52\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-30\",,\"63\",\"50\"\n\"USW00023272\",\"SAN FRANCISCO DOWNTOWN, CA US\",\"2021-12-31\",,\"63\",\"52\"\n"
    },
    "ch": 16
   },
   {
    "id": "16-4",
    "t": "Automatic Indexes",
    "orig": "Automatic Indexes",
    "lvl": 3,
    "tr": "In this section we hard-coded the indexes corresponding to the TMIN and TMAX columns. Use the header to determine the indexes, so the program works for either Sitka or Death Valley.",
    "steps": [
     {
      "f": "Import the {{modules}}: Path, csv, datetime, and matplotlib.",
      "k": {
       "modules": [
        "The same imports as the chapter's weather programs.",
        "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt"
       ]
      },
      "c": "from pathlib import Path\nimport csv\nfrom datetime import datetime\n\nimport matplotlib.pyplot as plt",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+csv$",
       "^from\\s+datetime\\s+import\\s+datetime$",
       "^import\\s+matplotlib\\.pyplot\\s+as\\s+plt$"
      ]
     },
     {
      "f": "Open the {{Death Valley}} file.",
      "k": {
       "Death Valley": [
        "The death_valley_2021_simple.csv file is in the weather_data folder.",
        "path = Path('weather_data/death_valley_2021_simple.csv')\nlines = path.read_text().splitlines()"
       ]
      },
      "c": "path = Path('weather_data/death_valley_2021_simple.csv')\nlines = path.read_text().splitlines()",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']weather_data/death_valley_2021_simple\\.csv[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)\\.splitlines\\(\\)$"
      ]
     },
     {
      "f": "Create the {{reader}} and read the header.",
      "k": {
       "reader": [
        "As always: csv.reader() and next() for the header row.",
        "reader = csv.reader(lines)\nheader_row = next(reader)"
       ]
      },
      "c": "reader = csv.reader(lines)\nheader_row = next(reader)",
      "re": [
       "^\\w+\\s*=\\s*csv\\.reader\\(\\s*\\w+\\s*\\)$",
       "^\\w+\\s*=\\s*next\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Find the indexes of {{DATE}} and NAME with header_row.index().",
      "k": {
       "DATE": [
        "header_row.index('DATE') returns the column's position: no numbers written by hand.",
        "date_index = header_row.index(\"DATE\")\nname_index = header_row.index(\"NAME\")"
       ]
      },
      "c": "date_index = header_row.index(\"DATE\")\nname_index = header_row.index(\"NAME\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']DATE[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']NAME[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Find the indexes of {{TMAX}} and TMIN.",
      "k": {
       "TMAX": [
        "The same technique for the temperature columns.",
        "tmax_index = header_row.index(\"TMAX\")\ntmin_index = header_row.index(\"TMIN\")"
       ]
      },
      "c": "tmax_index = header_row.index(\"TMAX\")\ntmin_index = header_row.index(\"TMIN\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']TMAX[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']TMIN[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Prepare the lists and start {{iterating}} over the rows.",
      "k": {
       "iterating": [
        "Get the station name from the first usable row and convert the date using the indexes you found.",
        "dates, highs, lows = [], [], []\nplace_name = \"\"\nfor row in reader:\n    if not place_name:\n        place_name = row[name_index]\n\n    current_date = datetime.strptime(row[date_index], '%Y-%m-%d')"
       ]
      },
      "c": "dates, highs, lows = [], [], []\nplace_name = \"\"\nfor row in reader:\n    if not place_name:\n        place_name = row[name_index]\n\n    current_date = datetime.strptime(row[date_index], '%Y-%m-%d')",
      "re": [
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$",
       "^\\w+\\s*=\\s*[\"\\'][\"\\']$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^if\\s+not\\s+\\w+:$",
       "^\\w+\\s*=\\s*\\w+\\[\\w+\\]$",
       "^\\w+\\s*=\\s*\\w+\\.strptime\\(\\w+\\[\\w+\\],\\s*[\"\\']%Y-%m-%d[\"\\']\\)$"
      ]
     },
     {
      "f": "Convert the {{highs}} and lows, protecting yourself from missing data.",
      "k": {
       "highs": [
        "int() on the indexes you found, with try/except that reports a missing value, and else that updates the lists.",
        "try:\n    high = int(row[tmax_index])\n    low = int(row[tmin_index])\nexcept ValueError:\n    print(f\"Missing data for {current_date}\")\nelse:\n    dates.append(current_date)\n    highs.append(high)\n    lows.append(low)"
       ]
      },
      "c": "try:\n    high = int(row[tmax_index])\n    low = int(row[tmin_index])\nexcept ValueError:\n    print(f\"Missing data for {current_date}\")\nelse:\n    dates.append(current_date)\n    highs.append(high)\n    lows.append(low)",
      "re": [
       "^try:$",
       "^\\w+\\s*=\\s*int\\(\\w+\\[\\w+\\]\\)$",
       "^\\w+\\s*=\\s*int\\(\\w+\\[\\w+\\]\\)$",
       "^except\\s+ValueError:$",
       "^print\\(.*\\)$",
       "^else:$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Draw the {{chart}} of highs and lows.",
      "k": {
       "chart": [
        "Two ax.plot() calls with alpha 0.5, and fill_between() with alpha 0.1.",
        "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red', alpha=0.5)\nax.plot(dates, lows, color='blue', alpha=0.5)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.1)"
       ]
      },
      "c": "plt.style.use('seaborn-v0_8')\nfig, ax = plt.subplots()\nax.plot(dates, highs, color='red', alpha=0.5)\nax.plot(dates, lows, color='blue', alpha=0.5)\nax.fill_between(dates, highs, lows, facecolor='blue', alpha=0.1)",
      "re": [
       "^plt\\.style\\.use\\(\\s*[\"']seaborn-v0_8[\"']\\s*\\)$",
       "^fig\\s*,\\s*ax\\s*=\\s*plt\\.subplots\\(\\)$",
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.plot\\(.*alpha\\s*=\\s*[\\d.]+\\)$",
       "^ax\\.fill_between\\(.*\\)$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Put the station {{name}} in the title, add labels, and show it.",
      "k": {
       "name": [
        "The title uses place_name in an f-string; then autofmt_xdate, ylabel, tick_params, and plt.show().",
        "title = f\"Daily high and low temperatures, 2021\\n{place_name}\"\nax.set_title(title, fontsize=20)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=16)\nax.tick_params(labelsize=16)\nplt.show()"
       ]
      },
      "c": "title = f\"Daily high and low temperatures, 2021\\n{place_name}\"\nax.set_title(title, fontsize=20)\nfig.autofmt_xdate()\nax.set_ylabel(\"Temperature (F)\", fontsize=16)\nax.tick_params(labelsize=16)\nplt.show()",
      "re": [
       "^\\w+\\s*=\\s*f[\"\\'].+\\{\\w+\\}[\"\\']$",
       "^ax\\.set_title\\(\\s*\\w+\\s*,\\s*fontsize\\s*=\\s*\\d+\\s*\\)$",
       "^fig\\.autofmt_xdate\\(\\)$",
       "^ax\\.set_ylabel\\(.*\\)$",
       "^ax\\.tick_params\\(.*\\)$",
       "^plt\\.show\\(\\)$"
      ]
     }
    ],
    "ch": 16
   },
   {
    "id": "16-5",
    "t": "Explore",
    "orig": "Explore",
    "lvl": 1,
    "tr": "Generate some other visualizations that examine other aspects of the weather you're interested in, for whichever locations you prefer.",
    "steps": [
     {
      "f": "Describe what you'll {{explore}} in the dataset.",
      "k": {
       "explore": [
        "Rainfall, wind, humidity, snowfall: pick an aspect that interests you.",
        "e.g. \"I want to look at snowfall in Sitka in 2021\""
       ]
      },
      "c": null,
      "ta": "What do you want to explore, and why? (min 15 characters)…",
      "min": 15
     }
    ],
    "ch": 16
   },
   {
    "id": "16-6",
    "t": "Refactoring",
    "orig": "Refactoring",
    "lvl": 2,
    "tr": "The loop that pulls the data out of <code>all_eq_dicts</code> uses temporary variables. Try pulling the values out directly and appending them to the appropriate lists in a single line, reducing the loop's body to four lines.",
    "steps": [
     {
      "f": "Import {{Path}}, json, and plotly.express.",
      "k": {
       "Path": [
        "Path to open the GeoJSON file, json to convert it into Python objects, plotly.express for the map.",
        "from pathlib import Path\nimport json\n\nimport plotly.express as px"
       ]
      },
      "c": "from pathlib import Path\nimport json\n\nimport plotly.express as px",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+json$",
       "^import\\s+plotly\\.express\\s+as\\s+px$"
      ]
     },
     {
      "f": "Read the {{GeoJSON}} file and convert it to Python objects.",
      "k": {
       "GeoJSON": [
        "The eq_data_30_day_m1.geojson file contains the earthquakes from the last 30 days.",
        "path = Path('eq_data/eq_data_30_day_m1.geojson')\ncontents = path.read_text()\nall_eq_data = json.loads(contents)"
       ]
      },
      "c": "path = Path('eq_data/eq_data_30_day_m1.geojson')\ncontents = path.read_text()\nall_eq_data = json.loads(contents)",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']eq_data/eq_data_30_day_m1\\.geojson[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)$",
       "^\\w+\\s*=\\s*json\\.loads\\(\\w+\\)$"
      ]
     },
     {
      "f": "Take the list of {{earthquakes}} from the features.",
      "k": {
       "earthquakes": [
        "Each earthquake is a \"feature\" in the GeoJSON.",
        "all_eq_dicts = all_eq_data['features']"
       ]
      },
      "c": "all_eq_dicts = all_eq_data['features']",
      "re": "^\\w+\\s*=\\s*\\w+\\[\\s*[\"']features[\"']\\s*\\]$"
     },
     {
      "f": "Initialize the {{lists}} for magnitudes, coordinates, and titles.",
      "k": {
       "lists": [
        "Four empty lists: mags, lons, lats, eq_titles.",
        "mags, lons, lats, eq_titles = [], [], [], []"
       ]
      },
      "c": "mags, lons, lats, eq_titles = [], [], [], []",
      "re": "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$"
     },
     {
      "f": "Rewrite the {{loop}} in compact form.",
      "k": {
       "loop": [
        "Instead of using temporary variables, append each value directly to the right list: the body becomes 4 lines.",
        "for eq_dict in all_eq_dicts:\n    mags.append(eq_dict[\"properties\"][\"mag\"])\n    lons.append(eq_dict[\"geometry\"][\"coordinates\"][0])\n    lats.append(eq_dict[\"geometry\"][\"coordinates\"][1])\n    eq_titles.append(eq_dict[\"properties\"][\"title\"])"
       ]
      },
      "c": "for eq_dict in all_eq_dicts:\n    mags.append(eq_dict[\"properties\"][\"mag\"])\n    lons.append(eq_dict[\"geometry\"][\"coordinates\"][0])\n    lats.append(eq_dict[\"geometry\"][\"coordinates\"][1])\n    eq_titles.append(eq_dict[\"properties\"][\"title\"])",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\.append\\(\\w+\\[\"properties\"\\]\\[\"mag\"\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"geometry\"\\]\\[\"coordinates\"\\]\\[\\d\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"geometry\"\\]\\[\"coordinates\"\\]\\[\\d\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"properties\"\\]\\[\"title\"\\]\\)$"
      ]
     },
     {
      "f": "Create the {{map}} with px.scatter_geo() and show it.",
      "k": {
       "map": [
        "size and color based on magnitude, the Viridis color scale, the natural earth projection, and hover_name for the titles.",
        "title = 'Global Earthquakes'\nfig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,\n        color=mags,\n        color_continuous_scale='Viridis',\n        labels={'color': 'Magnitude'},\n        projection='natural earth',\n        hover_name=eq_titles,\n    )\nfig.show()"
       ]
      },
      "c": "title = 'Global Earthquakes'\nfig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,\n        color=mags,\n        color_continuous_scale='Viridis',\n        labels={'color': 'Magnitude'},\n        projection='natural earth',\n        hover_name=eq_titles,\n    )\nfig.show()",
      "re": [
       "^\\w+\\s*=\\s*[\"\\'].+[\"\\']$",
       "^\\w+\\s*=\\s*px\\.scatter_geo\\(.*$",
       "^color\\s*=\\s*\\w+\\s*,?$",
       "^color_continuous_scale\\s*=\\s*[\"\\']\\w+[\"\\']\\s*,?$",
       "^labels\\s*=\\s*\\{.*\\}\\s*,?$",
       "^projection\\s*=\\s*[\"\\']\\w+\\s+\\w+[\"\\']\\s*,?$",
       "^hover_name\\s*=\\s*\\w+\\s*,?$",
       "^\\)\\s*$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 16
   },
   {
    "id": "16-7",
    "t": "Automated Title",
    "orig": "Automated Title",
    "lvl": 2,
    "tr": "Instead of the generic \"Global Earthquakes\" title, you can use the dataset's title in the metadata section of the GeoJSON file.",
    "steps": [
     {
      "f": "Import {{Path}}, json, and plotly.express.",
      "k": {
       "Path": [
        "As in the chapter's earthquake program.",
        "from pathlib import Path\nimport json\n\nimport plotly.express as px"
       ]
      },
      "c": "from pathlib import Path\nimport json\n\nimport plotly.express as px",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+json$",
       "^import\\s+plotly\\.express\\s+as\\s+px$"
      ]
     },
     {
      "f": "Read the {{GeoJSON}} file and convert it to Python objects.",
      "k": {
       "GeoJSON": [
        "The usual file of earthquakes from the last 30 days.",
        "path = Path('eq_data/eq_data_30_day_m1.geojson')\ncontents = path.read_text()\nall_eq_data = json.loads(contents)"
       ]
      },
      "c": "path = Path('eq_data/eq_data_30_day_m1.geojson')\ncontents = path.read_text()\nall_eq_data = json.loads(contents)",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']eq_data/eq_data_30_day_m1\\.geojson[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)$",
       "^\\w+\\s*=\\s*json\\.loads\\(\\w+\\)$"
      ]
     },
     {
      "f": "Extract the dataset's {{title}} from the metadata.",
      "k": {
       "title": [
        "In the GeoJSON, the metadata key holds the dataset's official title: use it instead of writing one by hand.",
        "title = all_eq_data[\"metadata\"][\"title\"]"
       ]
      },
      "c": "title = all_eq_data[\"metadata\"][\"title\"]",
      "re": "^\\w+\\s*=\\s*\\w+\\[\"metadata\"\\]\\[\"title\"\\]$"
     },
     {
      "f": "Take the list of {{earthquakes}} and initialize the lists.",
      "k": {
       "earthquakes": [
        "The GeoJSON features and the four lists for the plot.",
        "all_eq_dicts = all_eq_data['features']\nmags, lons, lats, eq_titles = [], [], [], []"
       ]
      },
      "c": "all_eq_dicts = all_eq_data['features']\nmags, lons, lats, eq_titles = [], [], [], []",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\[\\s*[\"']features[\"']\\s*\\]$",
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$"
      ]
     },
     {
      "f": "Extract each earthquake's {{data}} in compact form.",
      "k": {
       "data": [
        "Magnitude, longitude, latitude, and title, appended directly to the lists.",
        "for eq_dict in all_eq_dicts:\n    mags.append(eq_dict[\"properties\"][\"mag\"])\n    lons.append(eq_dict[\"geometry\"][\"coordinates\"][0])\n    lats.append(eq_dict[\"geometry\"][\"coordinates\"][1])\n    eq_titles.append(eq_dict[\"properties\"][\"title\"])"
       ]
      },
      "c": "for eq_dict in all_eq_dicts:\n    mags.append(eq_dict[\"properties\"][\"mag\"])\n    lons.append(eq_dict[\"geometry\"][\"coordinates\"][0])\n    lats.append(eq_dict[\"geometry\"][\"coordinates\"][1])\n    eq_titles.append(eq_dict[\"properties\"][\"title\"])",
      "re": [
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^\\w+\\.append\\(\\w+\\[\"properties\"\\]\\[\"mag\"\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"geometry\"\\]\\[\"coordinates\"\\]\\[\\d\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"geometry\"\\]\\[\"coordinates\"\\]\\[\\d\\]\\)$",
       "^\\w+\\.append\\(\\w+\\[\"properties\"\\]\\[\"title\"\\]\\)$"
      ]
     },
     {
      "f": "Create the {{map}} using the automated title.",
      "k": {
       "map": [
        "Pass the title variable to px.scatter_geo(): the dataset's official title will appear.",
        "fig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,\n        color=mags,\n        color_continuous_scale='Viridis',\n        labels={'color': 'Magnitude'},\n        projection='natural earth',\n        hover_name=eq_titles,\n    )"
       ]
      },
      "c": "fig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,\n        color=mags,\n        color_continuous_scale='Viridis',\n        labels={'color': 'Magnitude'},\n        projection='natural earth',\n        hover_name=eq_titles,\n    )",
      "re": [
       "^\\w+\\s*=\\s*px\\.scatter_geo\\(.*$",
       "^color\\s*=\\s*\\w+\\s*,?$",
       "^color_continuous_scale\\s*=\\s*[\"\\']\\w+[\"\\']\\s*,?$",
       "^labels\\s*=\\s*\\{.*\\}\\s*,?$",
       "^projection\\s*=\\s*[\"\\']\\w+\\s+\\w+[\"\\']\\s*,?$",
       "^hover_name\\s*=\\s*\\w+\\s*,?$",
       "^\\)\\s*$"
      ]
     },
     {
      "f": "Show the {{map}}.",
      "k": {
       "map": [
        "fig.show() draws the interactive map.",
        "fig.show()"
       ]
      },
      "c": "fig.show()",
      "re": "^\\w+\\.show\\(\\)$",
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 16
   },
   {
    "id": "16-8",
    "t": "Recent Earthquakes",
    "orig": "Recent Earthquakes",
    "lvl": 2,
    "tr": "You can find data files online with information about the most recent earthquakes in 1 hour, 1 day, 7 day, and 30 day periods. Download one of these datasets and create a visualization.",
    "steps": [
     {
      "f": "Visit {{earthquake.usgs.gov}} and choose a dataset.",
      "k": {
       "earthquake.usgs.gov": [
        "The USGS site offers GeoJSON feeds for various time windows.",
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"
       ]
      },
      "c": null,
      "btn": "✓ Dataset downloaded"
     },
     {
      "f": "Describe the {{file}} you downloaded.",
      "k": {
       "file": [
        "Give the file's name and the period it covers.",
        "e.g. \"eq_7_day_m1.geojson - M1+ earthquakes, last 7 days\""
       ]
      },
      "c": null,
      "ta": "Describe the dataset you downloaded (min 15 characters)…",
      "min": 15
     }
    ],
    "ch": 16
   },
   {
    "id": "16-9",
    "t": "World Fires",
    "orig": "World Fires",
    "lvl": 3,
    "tr": "The <code>world_fires_1_day.csv</code> file contains information about fires all over the world, with latitude, longitude, and brightness. Create a map that shows which parts of the world are affected by fires.",
    "steps": [
     {
      "f": "Import the {{modules}}: Path, csv, and plotly.express.",
      "k": {
       "modules": [
        "Path for the file, csv to read it, plotly.express for the map.",
        "from pathlib import Path\nimport csv\n\nimport plotly.express as px"
       ]
      },
      "c": "from pathlib import Path\nimport csv\n\nimport plotly.express as px",
      "re": [
       "^from\\s+pathlib\\s+import\\s+Path$",
       "^import\\s+csv$",
       "^import\\s+plotly\\.express\\s+as\\s+px$"
      ]
     },
     {
      "f": "Open the {{fires}} file.",
      "k": {
       "fires": [
        "world_fires_1_day.csv contains the fires active around the world in the last 24 hours.",
        "path = Path('eq_data/world_fires_1_day.csv')\nlines = path.read_text().splitlines()"
       ]
      },
      "c": "path = Path('eq_data/world_fires_1_day.csv')\nlines = path.read_text().splitlines()",
      "re": [
       "^\\w+\\s*=\\s*Path\\(\\s*[\"']eq_data/world_fires_1_day\\.csv[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.read_text\\(\\)\\.splitlines\\(\\)$"
      ]
     },
     {
      "f": "Create the {{reader}} and skip the header.",
      "k": {
       "reader": [
        "csv.reader() plus next() for the row of column names.",
        "reader = csv.reader(lines)\nheader_row = next(reader)"
       ]
      },
      "c": "reader = csv.reader(lines)\nheader_row = next(reader)",
      "re": [
       "^\\w+\\s*=\\s*csv\\.reader\\(\\s*\\w+\\s*\\)$",
       "^\\w+\\s*=\\s*next\\(\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Find the {{indexes}} of the latitude, longitude, and brightness columns.",
      "k": {
       "indexes": [
        "header_row.index() finds the positions without counting by hand.",
        "lat_idx = header_row.index(\"latitude\")\nlon_idx = header_row.index(\"longitude\")\nbright_idx = header_row.index(\"brightness\")"
       ]
      },
      "c": "lat_idx = header_row.index(\"latitude\")\nlon_idx = header_row.index(\"longitude\")\nbright_idx = header_row.index(\"brightness\")",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']latitude[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']longitude[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\w+\\.index\\(\\s*[\"']brightness[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Extract each fire's {{coordinates}} and brightness.",
      "k": {
       "coordinates": [
        "Three lists (lats, lons, brights) filled in the loop: float() can fail, protect it with try/except.",
        "lats, lons, brights = [], [], []\nfor row in reader:\n    try:\n        lat = float(row[lat_idx])\n        lon = float(row[lon_idx])\n        bright = float(row[bright_idx])\n    except ValueError:\n        print(f\"Invalid data for {row[5]}\")\n    else:\n        lats.append(lat)\n        lons.append(lon)\n        brights.append(bright)"
       ]
      },
      "c": "lats, lons, brights = [], [], []\nfor row in reader:\n    try:\n        lat = float(row[lat_idx])\n        lon = float(row[lon_idx])\n        bright = float(row[bright_idx])\n    except ValueError:\n        print(f\"Invalid data for {row[5]}\")\n    else:\n        lats.append(lat)\n        lons.append(lon)\n        brights.append(bright)",
      "re": [
       "^\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\[\\]\\s*,\\s*\\[\\]\\s*,\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+\\w+:$",
       "^try:$",
       "^\\w+\\s*=\\s*float\\(\\w+\\[\\w+\\]\\)$",
       "^\\w+\\s*=\\s*float\\(\\w+\\[\\w+\\]\\)$",
       "^\\w+\\s*=\\s*float\\(\\w+\\[\\w+\\]\\)$",
       "^except\\s+ValueError:$",
       "^print\\(.+\\)$",
       "^else:$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Create the {{map}} with px.scatter_geo().",
      "k": {
       "map": [
        "size and color based on brightness, with the YlOrRd scale, which suits fires.",
        "fig = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights, title=\"Global Fires\",\n        color_continuous_scale='YlOrRd')"
       ]
      },
      "c": "fig = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights, title=\"Global Fires\",\n        color_continuous_scale='YlOrRd')",
      "re": [
       "^\\w+\\s*=\\s*px\\.scatter_geo\\(.*$",
       "^color_continuous_scale\\s*=\\s*[\"']\\w+[\"']\\s*\\)$"
      ]
     },
     {
      "f": "Show the {{map}}.",
      "k": {
       "map": [
        "fig.show() draws the interactive map of the fires.",
        "fig.show()"
       ]
      },
      "c": "fig.show()",
      "re": "^\\w+\\.show\\(\\)$",
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 16
   }
  ]
 },
 {
  "n": 17,
  "t": "Working with APIs",
  "sub": "HTTP requests, processing JSON, and dynamic visualizations",
  "concepts": [
   "The requests module",
   "API calls and status codes",
   "Processing complex JSON responses",
   "The GitHub API and the Hacker News API",
   "Visualizing API data with Plotly"
  ],
  "ex": [
   {
    "id": "17-1",
    "t": "Other Languages",
    "orig": "Other Languages",
    "lvl": 2,
    "tr": "Modify the API call in <code>python_repos.py</code> so it generates a chart showing the most popular projects in other languages. Try JavaScript, Ruby, C, Java, Perl, Haskell, and Go.",
    "steps": [
     {
      "f": "Change the {{q}} parameter in the URL to a different language.",
      "k": {
       "q": [
        "Replace language:python with language:javascript (or another language).",
        "url = \"https://api.github.com/search/repositories?q=language:javascript+sort:stars+stars:>10000\""
       ]
      },
      "c": "url = \"https://api.github.com/search/repositories?q=language:javascript+sort:stars+stars:>10000\"",
      "re": "^\\w+\\s*=\\s*[\"'].*language:\\w+.*[\"']\\s*$"
     }
    ],
    "ch": 17
   },
   {
    "id": "17-2",
    "t": "Active Discussions",
    "orig": "Active Discussions",
    "lvl": 3,
    "tr": "Using the data in <code>hn_submissions.py</code>, make a bar chart showing the most active discussions on Hacker News. The height of each bar should correspond to the number of comments. Each label should be a link to the discussion.",
    "steps": [
     {
      "f": "Import {{itemgetter}}, requests, and plotly.express.",
      "k": {
       "itemgetter": [
        "itemgetter for sorting, requests for the Hacker News API, and px for the chart.",
        "from operator import itemgetter\n\nimport requests\nimport plotly.express as px"
       ]
      },
      "c": "from operator import itemgetter\n\nimport requests\nimport plotly.express as px",
      "re": [
       "^from\\s+operator\\s+import\\s+itemgetter$",
       "^import\\s+requests$",
       "^import\\s+plotly\\.express\\s+as\\s+px$"
      ]
     },
     {
      "f": "Download the list of top {{stories}}.",
      "k": {
       "stories": [
        "Call the Hacker News topstories API and print the status code to check the response.",
        "url = 'https://hacker-news.firebaseio.com/v0/topstories.json'\nr = requests.get(url)\nprint(f\"Status code: {r.status_code}\")"
       ]
      },
      "c": "url = 'https://hacker-news.firebaseio.com/v0/topstories.json'\nr = requests.get(url)\nprint(f\"Status code: {r.status_code}\")",
      "re": [
       "^\\w+\\s*=\\s*[\"']https://.+[\"']$",
       "^\\w+\\s*=\\s*requests\\.get\\(\\w+\\)$",
       "^print\\(f[\"'].+\\{.+\\}[\"']\\)$"
      ]
     },
     {
      "f": "For each {{story}}, download the details and build the dictionary.",
      "k": {
       "story": [
        "Take the first 10 stories; for each one, call the item API, print the id and status, and fill a dictionary with the title, link, and comments.",
        "submission_ids = r.json()\nsubmission_dicts = []\nfor submission_id in submission_ids[:10]:\n    url = f\"https://hacker-news.firebaseio.com/v0/item/{submission_id}.json\"\n    r = requests.get(url)\n    print(f\"id: {submission_id}\\tstatus: {r.status_code}\")\n    response_dict = r.json()\n    try:\n        submission_dict = {\n            'title': response_dict['title'],\n            'hn_link': f\"https://news.ycombinator.com/item?id={submission_id}\",\n            'comments': response_dict['descendants'],\n        }\n    except KeyError:\n        continue\n    else:\n        submission_dicts.append(submission_dict)"
       ]
      },
      "c": "submission_ids = r.json()\nsubmission_dicts = []\nfor submission_id in submission_ids[:10]:\n    url = f\"https://hacker-news.firebaseio.com/v0/item/{submission_id}.json\"\n    r = requests.get(url)\n    print(f\"id: {submission_id}\\tstatus: {r.status_code}\")\n    response_dict = r.json()\n    try:\n        submission_dict = {\n            'title': response_dict['title'],\n            'hn_link': f\"https://news.ycombinator.com/item?id={submission_id}\",\n            'comments': response_dict['descendants'],\n        }\n    except KeyError:\n        continue\n    else:\n        submission_dicts.append(submission_dict)",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.json\\(\\)$",
       "^\\w+\\s*=\\s*\\[\\]$",
       "^for\\s+\\w+\\s+in\\s+\\w+\\[\\s*:\\s*\\d+\\s*\\]:$",
       "^\\w+\\s*=\\s*f[\"\\']https://.+[\"\\']$",
       "^\\w+\\s*=\\s*requests\\.get\\(\\w+\\)$",
       "^print\\(f[\"\\'].+[\"\\']\\)$",
       "^\\w+\\s*=\\s*\\w+\\.json\\(\\)$",
       "^try:$",
       "^\\w+\\s*=\\s*\\{$",
       "^[\"\\']\\w+[\"\\']\\s*:\\s*.+,$",
       "^[\"\\']\\w+[\"\\']\\s*:\\s*.+,$",
       "^[\"\\']\\w+[\"\\']\\s*:\\s*.+,$",
       "^\\}\\s*,?$",
       "^except\\s+KeyError:$",
       "^continue$",
       "^else:$",
       "^\\w+\\.append\\(\\w+\\)$"
      ]
     },
     {
      "f": "Sort the {{submissions}} by number of comments.",
      "k": {
       "submissions": [
        "Use sorted() with itemgetter('comments') on submission_dicts.",
        "submission_dicts = sorted(submission_dicts, key=itemgetter(\"comments\"), reverse=True)"
       ]
      },
      "c": "submission_dicts = sorted(submission_dicts, key=itemgetter(\"comments\"), reverse=True)",
      "re": "^\\w+\\s*=\\s*sorted\\(\\s*\\w+\\s*,\\s*key\\s*=\\s*\\w+\\(\\s*[\"'].+[\"']\\s*\\)\\s*,\\s*reverse\\s*=\\s*True\\s*\\)$"
     },
     {
      "f": "Build the bar {{grafico}} with Plotly.",
      "k": {
       "grafico": [
        "Pull the titles, links, and comments into separate lists, then call px.bar().",
        "titles = [s[\"title\"] for s in submission_dicts]\nlinks = [s[\"hn_link\"] for s in submission_dicts]\ncomments = [s[\"comments\"] for s in submission_dicts]\nfig = px.bar(x=titles, y=comments)"
       ]
      },
      "c": "titles = [s[\"title\"] for s in submission_dicts]\nlinks = [s[\"hn_link\"] for s in submission_dicts]\ncomments = [s[\"comments\"] for s in submission_dicts]\nfig = px.bar(x=titles, y=comments)",
      "re": [
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$",
       "^\\w+\\s*=\\s*\\[\\s*\\w+\\[\\s*[\"'].+[\"']\\s*\\]\\s+for\\s+\\w+\\s+in\\s+\\w+\\s*\\]$",
       "^\\w+\\s*=\\s*px\\.bar\\(\\s*\\w+\\s*=\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*\\w+\\s*\\)$"
      ]
     },
     {
      "f": "Customize the {{grafico}} and show it.",
      "k": {
       "grafico": [
        "Set the title, axis labels, and bar color; then call fig.show().",
        "fig.update_layout(title=\"Most Active Discussions on Hacker News\",\n        xaxis_title=\"Article\", yaxis_title=\"Number of comments\")\nfig.update_traces(marker_color=\"SteelBlue\", marker_opacity=0.6)\nfig.show()"
       ]
      },
      "c": "fig.update_layout(title=\"Most Active Discussions on Hacker News\",\n        xaxis_title=\"Article\", yaxis_title=\"Number of comments\")\nfig.update_traces(marker_color=\"SteelBlue\", marker_opacity=0.6)\nfig.show()",
      "re": [
       "^\\w+\\.update_layout\\(.*$",
       "^xaxis_title\\s*=\\s*[\"\\'].+[\"\\']\\s*,\\s*yaxis_title\\s*=\\s*[\"\\'].+[\"\\']\\s*\\)$",
       "^\\w+\\.update_traces\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 17
   },
   {
    "id": "17-3",
    "t": "Testing python_repos.py",
    "orig": "Testing python_repos.py",
    "lvl": 3,
    "tr": "Write a program called <code>test_python_repos.py</code> that uses pytest to assert that the value of <code>status_code</code> is 200. Figure out other assertions you can make: for example, that the number of items returned is what you expect, and that the total number of repositories is greater than a certain threshold.",
    "steps": [
     {
      "f": "Import {{requests}} and define the URL for the call.",
      "k": {
       "requests": [
        "The URL is the one for the Python repository search API.",
        "import requests\nurl = \"https://api.github.com/search/repositories?q=language:python+sort:stars+stars:>10000\""
       ]
      },
      "c": "import requests\nurl = \"https://api.github.com/search/repositories?q=language:python+sort:stars+stars:>10000\"",
      "re": [
       "^import\\s+requests\\s*$",
       "^\\w+\\s*=\\s*[\"'].+[\"']\\s*$"
      ],
      "btn": "✓ Ran locally with pytest"
     },
     {
      "f": "Write the {{test}} for status_code.",
      "k": {
       "test": [
        "Inside the test function, make the call and assert that the status code is 200.",
        "def test_status_code():\n    r = requests.get(url)\n    assert r.status_code == 200"
       ]
      },
      "c": "def test_status_code():\n    r = requests.get(url)\n    assert r.status_code == 200",
      "re": [
       "^def\\s+test_\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)$",
       "^assert\\s+\\w+\\.\\w+\\s*==\\s*200$"
      ],
      "btn": "✓ Ran locally with pytest"
     },
     {
      "f": "Add a second {{test}} with more assertions about the data.",
      "k": {
       "test": [
        "For example, check that 'items' isn't empty, or that total_count > 1000.",
        "def test_contents():\n    r = requests.get(url)\n    assert \"items\" in r.json()\n    assert r.json()[\"total_count\"] > 1000"
       ]
      },
      "c": "def test_contents():\n    r = requests.get(url)\n    assert \"items\" in r.json()\n    assert r.json()[\"total_count\"] > 1000",
      "re": [
       "^def\\s+test_\\w+\\(\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\(\\s*\\w+\\s*\\)$",
       "^assert\\s+[\"'].+[\"']\\s+in\\s+\\w+\\.\\w+\\(\\)$",
       "^assert\\s+\\w+\\.\\w+\\(\\)\\[\\s*[\"'].+[\"']\\s*\\]\\s*>\\s*\\d+$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 17
   },
   {
    "id": "17-4",
    "t": "Further Exploration",
    "orig": "Further Exploration",
    "lvl": 2,
    "tr": "Visit the Plotly documentation and the documentation for the GitHub API or the Hacker News API. Use some of the information you find to customize the styling of your charts, or to extract different kinds of information.",
    "steps": [
     {
      "f": "Explore the {{documentation}} and pick an idea.",
      "k": {
       "documentation": [
        "The plotly.com/python gallery shows dozens of chart types along with their code: bar, line, scatter, heat map…",
        "plotly.com/python → Gallery: every example has ready-made code to adapt"
       ]
      },
      "c": null,
      "btn": "✓ Gallery explored"
     },
     {
      "f": "Make a chart of your choice and {{customize it}}.",
      "k": {
       "customize it": [
        "A complete example: a bar chart of squares, with marker_color and marker_opacity modified using update_traces().",
        "import plotly.express as px\nx_values = [1, 2, 3, 4, 5, 6]\ny_values = [1, 4, 9, 16, 25, 36]\nfig = px.bar(x=x_values, y=y_values, title=\"The squares of the first 6 numbers\")\nfig.update_traces(marker_color=\"SteelBlue\", marker_opacity=0.6)\nfig.show()"
       ]
      },
      "c": "import plotly.express as px\nx_values = [1, 2, 3, 4, 5, 6]\ny_values = [1, 4, 9, 16, 25, 36]\nfig = px.bar(x=x_values, y=y_values, title=\"The squares of the first 6 numbers\")\nfig.update_traces(marker_color=\"SteelBlue\", marker_opacity=0.6)\nfig.show()",
      "re": [
       "^import\\s+plotly\\.express\\s+as\\s+px$",
       "^\\w+\\s*=\\s*\\[\\s*[\\d,\\s]+\\]$",
       "^\\w+\\s*=\\s*\\[\\s*[\\d,\\s]+\\]$",
       "^\\w+\\s*=\\s*px\\.\\w+\\(.*\\)$",
       "^\\w+\\.update_traces\\(.*\\)$",
       "^\\w+\\.show\\(\\)$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "ch": 17
   }
  ]
 },
 {
  "n": 18,
  "t": "Getting Started with Django",
  "sub": "The Learning Log project, models, the admin site, and the first pages",
  "concepts": [
   "Virtual environments and the structure of a Django project",
   "The settings.py file",
   "Models: CharField, DateTimeField, ForeignKey",
   "Database migrations",
   "The Django admin site and the superuser",
   "Views, URL patterns, and templates",
   "Template inheritance"
  ],
  "ex": [
   {
    "id": "18-1",
    "t": "New Projects",
    "orig": "New Projects",
    "lvl": 1,
    "tr": "To get a better sense of what Django does, build a couple of empty projects and look at what it creates. Use simple names like <code>tik_gram</code> or <code>insta_tok</code>.",
    "steps": [
     {
      "f": "Create a {{virtual}} environment and install Django.",
      "k": {
       "virtual": [
        "Two commands: venv to create the environment, pip to install Django.",
        "python -m venv ll_env\nsource ll_env/bin/activate\npip install django"
       ]
      },
      "c": "python -m venv ll_env\nsource ll_env/bin/activate\npip install django",
      "re": [
       "^python\\s+-m\\s+venv\\s+\\w+$",
       "^source\\s+\\w+/bin/activate$",
       "^pip\\s+install\\s+django$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Run {{startproject}} with the trailing period.",
      "k": {
       "startproject": [
        "The trailing period creates a structure that's ready to deploy.",
        "django-admin startproject tg_project ."
       ]
      },
      "c": "django-admin startproject tg_project .",
      "re": "^django-admin\\s+startproject\\s+\\w+\\s+\\.$",
      "btn": "✓ Ran locally"
     }
    ],
    "noRun": "shell",
    "ch": 18
   },
   {
    "id": "18-2",
    "t": "Short Entries",
    "orig": "Short Entries",
    "lvl": 2,
    "tr": "The <code>__str__()</code> method in the Entry model adds ellipses to every instance. Add an if statement that adds them only when the entry is longer than 50 characters.",
    "steps": [
     {
      "f": "Modify the {{__str__}} method to check the length.",
      "k": {
       "__str__": [
        "If len(text) > 50, add \"...\"; otherwise, return just the text.",
        "def __str__(self):\n    if len(self.text) > 50:\n        return f\"{self.text[:50]}...\"\n    return self.text"
       ]
      },
      "c": "def __str__(self):\n    if len(self.text) > 50:\n        return f\"{self.text[:50]}...\"\n    return self.text",
      "re": [
       "^def\\s+__str__\\(\\s*self\\s*\\)\\s*:$",
       "^if\\s+len\\(\\s*self\\.\\w+\\s*\\)\\s*>\\s*50\\s*:$",
       "^return\\s+f[\"'].*\\{self\\.\\w+\\[.+\\]\\}.*[\"']$",
       "^return\\s+self\\.\\w+$"
      ]
     }
    ],
    "ch": 18
   },
   {
    "id": "18-3",
    "t": "The Django API",
    "orig": "The Django API",
    "lvl": 1,
    "tr": "Whenever you write code to access the data in your project, you're writing a query. Take a look at the documentation about querying data.",
    "steps": [
     {
      "f": "Read the {{documentation}} on queries.",
      "k": {
       "documentation": [
        "The Django ORM has a very expressive syntax for querying data.",
        "https://docs.djangoproject.com/en/4.1/topics/db/queries"
       ]
      },
      "c": null,
      "btn": "✓ Documentation read"
     }
    ],
    "ch": 18
   },
   {
    "id": "18-4",
    "t": "Pizzeria",
    "orig": "Pizzeria",
    "lvl": 3,
    "tr": "Start a new project called <code>pizzeria_project</code> with an app called <code>pizzas</code>. Define a <code>Pizza</code> model with a <code>name</code> field. Define a <code>Topping</code> model with <code>pizza</code> (a Foreign Key to Pizza) and <code>name</code> fields. Register both models with the admin site, and enter some data.",
    "steps": [
     {
      "f": "Define the {{Pizza}} model.",
      "k": {
       "Pizza": [
        "A model with a CharField for the name.",
        "class Pizza(models.Model):\n    name = models.CharField(max_length=200)\n    def __str__(self):\n        return self.name"
       ]
      },
      "c": "class Pizza(models.Model):\n    name = models.CharField(max_length=200)\n    def __str__(self):\n        return self.name",
      "re": [
       "^class\\s+\\w+\\(\\s*models\\.\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*models\\.CharField\\(\\s*max_length\\s*=\\s*\\d+\\s*\\)$",
       "^def\\s+__str__\\(\\s*self\\s*\\)\\s*:$",
       "^return\\s+self\\.\\w+$"
      ]
     },
     {
      "f": "Define the {{Topping}} model with the ForeignKey.",
      "k": {
       "Topping": [
        "The pizza field is a ForeignKey to Pizza, with on_delete=models.CASCADE.",
        "class Topping(models.Model):\n    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE)\n    name = models.CharField(max_length=200)\n    def __str__(self):\n        return self.name"
       ]
      },
      "c": "class Topping(models.Model):\n    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE)\n    name = models.CharField(max_length=200)\n    def __str__(self):\n        return self.name",
      "re": [
       "^class\\s+\\w+\\(\\s*models\\.\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*models\\.ForeignKey\\(\\s*\\w+\\s*,\\s*on_delete\\s*=\\s*models\\.CASCADE\\s*\\)$",
       "^\\w+\\s*=\\s*models\\.CharField\\(\\s*max_length\\s*=\\s*\\d+\\s*\\)$",
       "^def\\s+__str__\\(\\s*self\\s*\\)\\s*:$",
       "^return\\s+self\\.\\w+$"
      ]
     },
     {
      "f": "Run the {{migrations}} and register the models with the admin site.",
      "k": {
       "migrations": [
        "makemigrations + migrate, then admin.site.register() for both.",
        "python manage.py makemigrations pizzas\npython manage.py migrate\n# in admin.py:\nadmin.site.register(Pizza)\nadmin.site.register(Topping)"
       ]
      },
      "c": "python manage.py makemigrations pizzas\npython manage.py migrate",
      "re": [
       "^python\\s+manage\\.py\\s+makemigrations\\s+\\w+$",
       "^python\\s+manage\\.py\\s+migrate$"
      ],
      "btn": "✓ Ran locally"
     }
    ],
    "noRun": "django",
    "ch": 18
   },
   {
    "id": "18-5",
    "t": "Meal Planner",
    "orig": "Meal Planner",
    "lvl": 2,
    "tr": "Consider an app that helps people plan their meals for the week. Make a new folder called <code>meal_planner</code> and start a new Django project. Then make an app called <code>meal_plans</code> and a simple home page.",
    "steps": [
     {
      "f": "Create the project and the {{meal_plans}} app.",
      "k": {
       "meal_plans": [
        "Two commands: startproject and startapp.",
        "django-admin startproject meal_planner .\npython manage.py startapp meal_plans"
       ]
      },
      "c": "django-admin startproject meal_planner .\npython manage.py startapp meal_plans",
      "re": [
       "^django-admin\\s+startproject\\s+\\w+\\s+\\.$",
       "^python\\s+manage\\.py\\s+startapp\\s+\\w+$"
      ],
      "btn": "✓ Ran locally"
     },
     {
      "f": "Write the {{view}} for the home page.",
      "k": {
       "view": [
        "A view that calls render() with a template.",
        "def index(request):\n    return render(request, \"meal_plans/index.html\")"
       ]
      },
      "c": "def index(request):\n    return render(request, \"meal_plans/index.html\")",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^return\\s+\\w+\\(\\s*\\w+\\s*,\\s*[\"'].+[\"']\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 18
   },
   {
    "id": "18-6",
    "t": "Pizzeria Home Page",
    "orig": "Pizzeria Home Page",
    "lvl": 2,
    "tr": "Add a home page to the Pizzeria project from Exercise 18-4.",
    "steps": [
     {
      "f": "Create the home page {{template}}.",
      "k": {
       "template": [
        "Create pizzas/templates/pizzas/index.html with a simple paragraph.",
        "<p>Welcome to the Pizzeria!</p>"
       ]
      },
      "c": "<p>Welcome to the Pizzeria!</p>",
      "re": "^<p>.+</p>$"
     },
     {
      "f": "Map the {{index}} view to a URL.",
      "k": {
       "index": [
        "In pizzas/urls.py, add a path for the view.",
        "urlpatterns = [\n    path(\"\", views.index, name=\"index\"),\n]"
       ]
      },
      "c": "urlpatterns = [\n    path(\"\", views.index, name=\"index\"),\n]",
      "re": [
       "^urlpatterns\\s*=\\s*\\[$",
       "^path\\(\\s*[\"\\'].*[\"\\']\\s*,\\s*\\w+\\.\\w+\\s*,\\s*name\\s*=\\s*[\"\\'].+[\"\\']\\s*\\)\\s*,?\\s*$",
       "^\\]$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 18
   },
   {
    "id": "18-7",
    "t": "Template Documentation",
    "orig": "Template Documentation",
    "lvl": 1,
    "tr": "Skim the Django template documentation. You can refer back to it in the future when you're working on your own projects.",
    "steps": [
     {
      "f": "Visit the template {{documentation}}.",
      "k": {
       "documentation": [
        "Filters, tags, and template inheritance are the key concepts.",
        "https://docs.djangoproject.com/en/4.1/ref/templates"
       ]
      },
      "c": null,
      "btn": "✓ Documentation read"
     }
    ],
    "ch": 18
   },
   {
    "id": "18-8",
    "t": "Pizzeria Pages",
    "orig": "Pizzeria Pages",
    "lvl": 3,
    "tr": "Add a page to the Pizzeria project that shows the names of the pizzas available. Then link each name to a page that shows that pizza's toppings. Use template inheritance.",
    "steps": [
     {
      "f": "Create the base {{template}} with inheritance.",
      "k": {
       "template": [
        "A base file with a block content that the other pages then extend.",
        "{% block content %}{% endblock content %}"
       ]
      },
      "c": "{% block content %}{% endblock content %}",
      "re": "^\\{%\\s*block\\s+\\w+\\s*%\\}\\{%\\s*endblock\\s+\\w+\\s*%\\}$"
     },
     {
      "f": "Create the {{pizza}} page with the list of toppings.",
      "k": {
       "pizza": [
        "Iterate over topping_set.all() to get the toppings.",
        "{% for topping in pizza.topping_set.all %}\n    <li>{{ topping.name }}</li>\n{% endfor %}"
       ]
      },
      "c": "{% for topping in pizza.topping_set.all %}\n    <li>{{ topping.name }}</li>\n{% endfor %}",
      "re": [
       "^\\{%\\s*for\\s+\\w+\\s+in\\s+\\w+\\.\\w+\\.\\w+\\s*%\\}$",
       "^<li>.+</li>$",
       "^\\{%\\s*endfor\\s*%\\}$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 18
   }
  ]
 },
 {
  "n": 19,
  "t": "User Accounts",
  "sub": "Forms, authentication, registration, and protecting data",
  "concepts": [
   "ModelForm and validation",
   "GET vs POST",
   "csrf_token",
   "The @login_required decorator",
   "Login/logout/register",
   "Tying data to the user with a ForeignKey"
  ],
  "ex": [
   {
    "id": "19-1",
    "t": "Blog",
    "orig": "Blog",
    "lvl": 3,
    "tr": "Start a new Django project called Blog. Create an app called <code>blogs</code> with two models: one for the blog and one for posts. Create a superuser and use the admin site to create a blog and a couple of posts. Make a home page that shows all posts. Make pages for creating a blog, creating posts, and editing existing posts.",
    "steps": [
     {
      "f": "Define the {{Blog}} and {{Post}} models.",
      "k": {
       "Blog": [
        "The blog has a name and a date.",
        "class Blog(models.Model):\n    name = models.CharField(max_length=200)\n    date_added = models.DateTimeField(auto_now_add=True)"
       ],
       "Post": [
        "The post has a title, text, a date, and a ForeignKey to Blog.",
        "class Post(models.Model):\n    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)\n    title = models.CharField(max_length=200)\n    text = models.TextField()\n    date_added = models.DateTimeField(auto_now_add=True)"
       ]
      },
      "c": "class Blog(models.Model):\n    name = models.CharField(max_length=200)\n    date_added = models.DateTimeField(auto_now_add=True)",
      "re": [
       "^class\\s+\\w+\\(\\s*models\\.\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*models\\.CharField\\(\\s*max_length\\s*=\\s*\\d+\\s*\\)$",
       "^\\w+\\s*=\\s*models\\.DateTimeField\\(\\s*auto_now_add\\s*=\\s*True\\s*\\)$"
      ]
     },
     {
      "f": "Create the home page {{view}}.",
      "k": {
       "view": [
        "Get all the posts and pass them to the template.",
        "def index(request):\n    posts = Post.objects.order_by(\"-date_added\")\n    context = {\"posts\": posts}\n    return render(request, \"blogs/index.html\", context)"
       ]
      },
      "c": "def index(request):\n    posts = Post.objects.order_by(\"-date_added\")\n    context = {\"posts\": posts}\n    return render(request, \"blogs/index.html\", context)",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*\\)\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
       "^\\w+\\s*=\\s*\\{\\s*[\"'].+[\"']\\s*:\\s*\\w+\\s*\\}$",
       "^return\\s+\\w+\\(\\s*\\w+\\s*,\\s*[\"'].+[\"']\\s*,\\s*\\w+\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 19
   },
   {
    "id": "19-2",
    "t": "Blog Accounts",
    "orig": "Blog Accounts",
    "lvl": 3,
    "tr": "Add an authentication and registration system to the Blog project from Exercise 19-1. Logged-in users should see their username on the screen, while unregistered users should see a link to the registration page.",
    "steps": [
     {
      "f": "Add the {{accounts}} app to the project.",
      "k": {
       "accounts": [
        "Run startapp accounts, then add it to INSTALLED_APPS and the URLs.",
        "python manage.py startapp accounts\n# in settings.py: 'accounts'\n# in urls.py: path(\"accounts/\", include(\"accounts.urls\"))"
       ]
      },
      "c": "python manage.py startapp accounts",
      "re": "^python\\s+manage\\.py\\s+startapp\\s+\\w+$",
      "btn": "✓ Ran locally"
     },
     {
      "f": "Use {{user.is_authenticated}} in the base template.",
      "k": {
       "user.is_authenticated": [
        "Django automatically passes user to the templates.",
        "{% if user.is_authenticated %}\n    <p>Ciao {{ user.username }}!</p>\n{% else %}\n    <a href=\"{% url 'accounts:register' %}\">Registrati</a>\n{% endif %}"
       ]
      },
      "c": "{% if user.is_authenticated %}\n    <p>Ciao {{ user.username }}!</p>\n{% else %}\n    <a href=\"{% url 'accounts:register' %}\">Registrati</a>\n{% endif %}",
      "re": [
       "^\\{%\\s*if\\s+\\w+\\.\\w+\\s*%\\}$",
       "^<p>.+\\{\\{.+\\}\\}.+</p>$",
       "^\\{%\\s*else\\s*%\\}$",
       "^<a\\s+href\\s*=\\s*[\"'].+[\"']>.+</a>$",
       "^\\{%\\s*endif\\s*%\\}$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 19
   },
   {
    "id": "19-3",
    "t": "Refactoring",
    "orig": "Refactoring",
    "lvl": 2,
    "tr": "In views.py there are two places where we check that the user associated with a topic matches the logged-in user. Move that code into a function called <code>check_topic_owner()</code>, and call it wherever it's needed.",
    "steps": [
     {
      "f": "Define {{check_topic_owner}}.",
      "k": {
       "check_topic_owner": [
        "A function that raises Http404 if owner != request.user.",
        "def check_topic_owner(topic, request):\n    if topic.owner != request.user:\n        raise Http404"
       ]
      },
      "c": "def check_topic_owner(topic, request):\n    if topic.owner != request.user:\n        raise Http404",
      "re": [
       "^def\\s+\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)\\s*:$",
       "^if\\s+\\w+\\.\\w+\\s*!=\\s*\\w+\\.\\w+\\s*:$",
       "^raise\\s+\\w+$"
      ]
     },
     {
      "f": "Replace the existing {{checks}} (checks) with the call.",
      "k": {
       "checks": [
        "Instead of repeating if topic.owner != request.user: raise Http404, call the function.",
        "check_topic_owner(topic, request)"
       ]
      },
      "c": "check_topic_owner(topic, request)",
      "re": "^\\w+\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)$",
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 19
   },
   {
    "id": "19-4",
    "t": "Protecting new_entry",
    "orig": "Protecting new_entry",
    "lvl": 3,
    "tr": "Currently, a user can add an entry to another user's learning log by entering a URL with the ID of a topic that belongs to someone else. Prevent this attack by checking that the current user owns the topic the entry belongs to before saving the new entry.",
    "steps": [
     {
      "f": "Check the {{owner}} before form.save().",
      "k": {
       "owner": [
        "In the new_entry view, after getting the topic, check that owner == request.user.",
        "topic = Topic.objects.get(id=topic_id)\nif topic.owner != request.user:\n    raise Http404"
       ]
      },
      "c": "topic = Topic.objects.get(id=topic_id)\nif topic.owner != request.user:\n    raise Http404",
      "re": [
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+\\(\\s*\\w+\\s*=\\s*\\w+\\s*\\)$",
       "^if\\s+\\w+\\.\\w+\\s*!=\\s*\\w+\\.\\w+\\s*:$",
       "^raise\\s+\\w+$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 19
   },
   {
    "id": "19-5",
    "t": "Protected Blog",
    "orig": "Protected Blog",
    "lvl": 3,
    "tr": "In the Blog project, make sure each post is tied to a specific user. All posts should be publicly accessible, but only registered users can add and edit posts. Make sure whoever edits a post is editing their own post.",
    "steps": [
     {
      "f": "Add the ForeignKey to {{User}} in the Post model.",
      "k": {
       "User": [
        "Import User and add owner to the model.",
        "from django.contrib.auth.models import User\n# in the Post model:\nowner = models.ForeignKey(User, on_delete=models.CASCADE)"
       ]
      },
      "c": "owner = models.ForeignKey(User, on_delete=models.CASCADE)",
      "re": "^\\w+\\s*=\\s*models\\.ForeignKey\\(\\s*\\w+\\s*,\\s*on_delete\\s*=\\s*models\\.CASCADE\\s*\\)$"
     },
     {
      "f": "Filter the {{post}} by owner on the home page.",
      "k": {
       "post": [
        "Show all posts on the home page, but filter by owner in edit.",
        "posts = Post.objects.order_by(\"-date_added\")  # home\npost = Post.objects.get(id=post_id)  # edit\nif post.owner != request.user:\n    raise Http404"
       ]
      },
      "c": "posts = Post.objects.order_by(\"-date_added\")",
      "re": "^\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+\\(\\s*[\"'].+[\"']\\s*\\)$",
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 19
   }
  ]
 },
 {
  "n": 20,
  "t": "Styling and Deploying",
  "sub": "Bootstrap, django-bootstrap5, Git, and Platform.sh",
  "concepts": [
   "Installing django-bootstrap5",
   "The Navbar template",
   "A jumbotron for the home page",
   "Forms with bootstrap_form",
   "Git: init, add, commit, push",
   "Platform.sh: CLI, .platform.app.yaml, DEBUG=False"
  ],
  "ex": [
   {
    "id": "20-1",
    "t": "Other Forms",
    "orig": "Other Forms",
    "lvl": 2,
    "tr": "We applied Bootstrap styling to the login page. Make similar changes to the other pages with forms: <code>new_topic</code>, <code>new_entry</code>, <code>edit_entry</code>, and <code>register</code>.",
    "steps": [
     {
      "f": "Add {{load}} and {{bootstrap_form}} to the templates.",
      "k": {
       "load": [
        "Put {% load django_bootstrap5 %} at the top of the template.",
        "{% load django_bootstrap5 %}"
       ],
       "bootstrap_form": [
        "Replace {{ form.as_div }} with {% bootstrap_form form %}.",
        "{% bootstrap_form form %}"
       ]
      },
      "c": "{% load django_bootstrap5 %}\n{% bootstrap_form form %}",
      "re": [
       "^\\{%\\s*load\\s+django_bootstrap5\\s*%\\}$",
       "^\\{%\\s*bootstrap_form\\s+\\w+\\s*%\\}$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 20
   },
   {
    "id": "20-2",
    "t": "Stylish Blog",
    "orig": "Stylish Blog",
    "lvl": 2,
    "tr": "Use Bootstrap to style the Blog project you created in Chapter 19.",
    "steps": [
     {
      "f": "Add the Bootstrap {{navbar}} to base.html.",
      "k": {
       "navbar": [
        "Use Bootstrap's Navbar template as a starting point.",
        "<nav class=\"navbar navbar-expand-md navbar-light bg-light mb-4 border\">"
       ]
      },
      "c": "<nav class=\"navbar navbar-expand-md navbar-light bg-light mb-4 border\">",
      "re": "^<nav\\s+class\\s*=\\s*[\"'].*navbar.*[\"']>$",
      "btn": "✓ Tested locally"
     },
     {
      "f": "Add a {{jumbotron}} to the home page.",
      "k": {
       "jumbotron": [
        "A large div with Bootstrap padding and margins.",
        "<div class=\"p-3 mb-4 bg-light border rounded-3\">"
       ]
      },
      "c": "<div class=\"p-3 mb-4 bg-light border rounded-3\">",
      "re": "^<div\\s+class\\s*=\\s*[\"'].*p-3.*mb-4.*bg-light.*[\"']>$",
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 20
   },
   {
    "id": "20-3",
    "t": "Live Blog",
    "orig": "Live Blog",
    "lvl": 3,
    "tr": "Deploy the Blog project to Platform.sh. Make sure you set <code>DEBUG = False</code>, so users don't see Django's full error pages when something goes wrong.",
    "steps": [
     {
      "f": "Create {{requirements.txt}} and check DEBUG.",
      "k": {
       "requirements.txt": [
        "pip freeze > requirements.txt creates the file.",
        "pip freeze > requirements.txt"
       ]
      },
      "c": "pip freeze > requirements.txt",
      "re": "^pip\\s+freeze\\s+>\\s*\\w+\\.\\w+$",
      "btn": "✓ Ran locally"
     },
     {
      "f": "Set {{DEBUG}} = False in the Platform.sh section of settings.py.",
      "k": {
       "DEBUG": [
        "Inside if config.is_valid_platform(): add DEBUG = False.",
        "if config.is_valid_platform():\n    ALLOWED_HOSTS.append(\"platform.sh.site\")\n    DEBUG = False"
       ]
      },
      "c": "if config.is_valid_platform():\n    DEBUG = False",
      "re": [
       "^if\\s+\\w+\\.\\w+\\(\\)\\s*:$",
       "^DEBUG\\s*=\\s*False$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 20
   },
   {
    "id": "20-4",
    "t": "Extended Learning Log",
    "orig": "Extended Learning Log",
    "lvl": 3,
    "tr": "Add a feature to Learning Log and push it to the live deployment. Start with a simple change, then try a more advanced one: for example, giving users the option to make a topic public.",
    "steps": [
     {
      "f": "Add the {{public}} field to the Topic model.",
      "k": {
       "public": [
        "A BooleanField with default=False.",
        "public = models.BooleanField(default=False)"
       ]
      },
      "c": "public = models.BooleanField(default=False)",
      "re": "^\\w+\\s*=\\s*models\\.BooleanField\\(\\s*default\\s*=\\s*False\\s*\\)$"
     },
     {
      "f": "Add the public field to {{TopicForm}}.",
      "k": {
       "TopicForm": [
        "Include \"public\" in the Meta fields list.",
        "class Meta:\n    model = Topic\n    fields = [\"text\", \"public\"]"
       ]
      },
      "c": "fields = [\"text\", \"public\"]",
      "re": "^fields\\s*=\\s*\\[\\s*[\"'].+[\"']\\s*,\\s*[\"'].+[\"']\\s*\\]$",
      "btn": "✓ Tested locally"
     },
     {
      "f": "Update the {{topics}} view to show public topics to anonymous users.",
      "k": {
       "topics": [
        "If the user is authenticated, show their own topics; otherwise show those with public=True.",
        "if request.user.is_authenticated:\n    topics = Topic.objects.filter(owner=request.user).order_by(\"date_added\")\nelse:\n    topics = Topic.objects.filter(public=True).order_by(\"date_added\")"
       ]
      },
      "c": "if request.user.is_authenticated:\n    topics = Topic.objects.filter(owner=request.user).order_by(\"date_added\")\nelse:\n    topics = Topic.objects.filter(public=True).order_by(\"date_added\")",
      "re": [
       "^if\\s+\\w+\\.\\w+\\.\\w+(\\(\\))?\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+\\(\\s*\\w+\\s*=\\s*\\w+\\.\\w+\\s*\\)\\.\\w+\\(\\s*[\"\\'].+[\"\\']\\s*\\)$",
       "^else\\s*:$",
       "^\\w+\\s*=\\s*\\w+\\.\\w+\\.\\w+\\(\\s*\\w+\\s*=\\s*True\\s*\\)\\.\\w+\\(\\s*[\"\\'].+[\"\\']\\s*\\)$"
      ],
      "btn": "✓ Tested locally"
     }
    ],
    "noRun": "django",
    "ch": 20
   }
  ]
 },
 {
  "n": 21,
  "t": "Git: Version Control",
  "sub": "Repositories, commits, history, restoring",
  "concepts": [
   "git init",
   "git status",
   "git add",
   "git commit -m / -am",
   "git log",
   "git restore .",
   "git checkout (detached HEAD)",
   "git reset --hard",
   "rm -rf .git + re-creating"
  ],
  "ex": [
   {
    "id": "21-1",
    "t": "First Git Repository",
    "orig": "First Git Repository",
    "lvl": 1,
    "tr": "Open a terminal, create (or open) a folder called <code>git_practice</code>, and initialize a Git repository there. Check that the folder is empty and that the repository was created. (Note: these are shell commands, not Python — run them in your terminal, and do not click the Run button in the tutor.)",
    "steps": [
     {
      "f": "Move into the {{git_practice}} folder and initialize the repository.",
      "k": {
       "git_practice": [
        "Use <code>cd</code> to enter the folder, then <code>git init</code> to initialize it. The command creates a hidden <code>.git</code> subfolder where Git stores the entire history.",
        "cd git_practice\ngit init"
       ]
      },
      "c": "cd git_practice\ngit init",
      "re": [
       "^cd\\s+\\w+\\s*$",
       "^git\\s+init\\s*$"
      ],
      "note": "Shell command: run it in the VS Code terminal, not in the Python sandbox."
     },
     {
      "f": "Check the {{status}} of the repository.",
      "k": {
       "status": [
        "<code>git status</code> shows the current state: the branch, tracked files, and untracked files.",
        "git status"
       ]
      },
      "c": "git status",
      "re": "^git\\s+status\\s*$",
      "so": [
       "On branch main",
       "No commits yet",
       "nothing to commit"
      ]
     },
     {
      "f": "Describe what {{git init}} created.",
      "k": {
       "git init": [
        "Answer in English: what do you find in the folder after running the command?",
        "e.g. \"A hidden .git folder that holds all the repository metadata\""
       ]
      },
      "c": null,
      "ta": "What does the .git folder contain, and what is it for? (min 15 characters)…",
      "min": 15
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-2",
    "t": "First Commit",
    "orig": "First Commit",
    "lvl": 2,
    "tr": "Create a <code>hello_git.py</code> file with a single greeting line, also add a <code>.gitignore</code> to exclude cache folders, add everything to the repository, and make the first commit with a meaningful message.",
    "steps": [
     {
      "f": "Create the {{.gitignore}} file to exclude cache and database files.",
      "k": {
       ".gitignore": [
        "The file lists the patterns to ignore: folders with a trailing <code>/</code>, extensions with <code>*</code>.",
        "# .gitignore\n__pycache__/\n*.sqlite3"
       ]
      },
      "c": "# .gitignore\n__pycache__/\n*.sqlite3",
      "re": [
       "^__pycache__/$",
       "^\\*\\.sqlite3$"
      ]
     },
     {
      "f": "Add all {{non-ignored}} files to the staging area.",
      "k": {
       "non-ignored": [
        "<code>git add .</code> stages every non-ignored file (in the current folder and its subfolders). The trailing dot is essential.",
        "git add ."
       ]
      },
      "c": "git add .",
      "re": "^git\\s+add\\s+\\.\\s*$"
     },
     {
      "f": "Make the {{first commit}} with a descriptive message.",
      "k": {
       "first commit": [
        "<code>git commit -m \"message\"</code> saves the current state. The <code>-m</code> flag lets you write the message right on the command line.",
        "git commit -m \"Started project.\""
       ]
      },
      "c": "git commit -m \"Started project.\"",
      "re": "^git\\s+commit\\s+-m\\s+[\"'].+[\"']\\s*$",
      "so": [
       "[main (root-commit)] Started project.",
       "1 file changed"
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-3",
    "t": "Second Commit",
    "orig": "Second Commit",
    "lvl": 2,
    "tr": "Edit <code>hello_git.py</code> to add a new line, then check the status and make a second commit with the <code>-am</code> flags. The <code>-a</code> flag automatically stages every file that is already tracked.",
    "steps": [
     {
      "f": "Edit the file, then {{check}} the status.",
      "k": {
       "check": [
        "<code>git status</code> will show \"modified: hello_git.py\" until you commit.",
        "git status"
       ]
      },
      "c": "git status",
      "re": "^git\\s+status\\s*$",
      "so": [
       "On branch main",
       "Changes not staged for commit:",
       "modified: hello_git.py"
      ]
     },
     {
      "f": "Commit with the {{-am}} flags to stage and commit in one shot.",
      "k": {
       "-am": [
        "<code>-a</code> = automatically stage tracked files; <code>-m</code> = message. It only works with files that are already tracked (not with new files).",
        "git commit -am \"Extended greeting.\""
       ]
      },
      "c": "git commit -am \"Extended greeting.\"",
      "re": "^git\\s+commit\\s+-am\\s+[\"'].+[\"']\\s*$",
      "so": [
       "[main 945fa13] Extended greeting.",
       "1 file changed, 1 insertion(+), 1 deletion(-)"
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-4",
    "t": "Commit History",
    "orig": "Commit History",
    "lvl": 2,
    "tr": "View the repository's history in a compact format and identify the two commits made so far.",
    "steps": [
     {
      "f": "Show the {{history}} in oneline format.",
      "k": {
       "history": [
        "<code>git log --pretty=oneline</code> shows each commit on one line: hash + message.",
        "git log --pretty=oneline"
       ]
      },
      "c": "git log --pretty=oneline",
      "re": "^git\\s+log\\s+--pretty=oneline\\s*$",
      "so": [
       "945fa13af12a... Extended greeting.",
       "cea13ddc51b8... Started project."
      ]
     },
     {
      "f": "Describe how to {{identifica}} a commit.",
      "k": {
       "identifica": [
        "Answer with the information you use to identify a commit.",
        "e.g. \"The SHA-1 hash (the first 6 characters), together with the message\""
       ]
      },
      "c": null,
      "ta": "How do you identify a commit in the history? (min 15 characters)…",
      "min": 15
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-5",
    "t": "Abandoning Changes",
    "orig": "Abandoning Changes",
    "lvl": 3,
    "tr": "Add a deliberately wrong line of code to <code>hello_git.py</code>, then abandon the change with <code>git restore .</code> without touching the file by hand. Verify that the file is back to the state of the last commit.",
    "steps": [
     {
      "f": "Add a {{wrong}} line and check that Git notices it.",
      "k": {
       "wrong": [
        "E.g. a print statement with a logic error. Then <code>git status</code> will show \"modified\".",
        "print(\"Oh no, I broke the project!\")\ngit status"
       ]
      },
      "c": "print(\"Oh no, I broke the project!\")\ngit status",
      "re": [
       "^print\\s*\\(.+\\)$",
       "^git\\s+status\\s*$"
      ],
      "so": [
       "On branch main",
       "modified: hello_git.py"
      ]
     },
     {
      "f": "Abandon the change with {{git restore}}.",
      "k": {
       "git restore": [
        "<code>git restore .</code> restores every uncommitted file to the state of the last commit. Alternative: <code>git restore hello_git.py</code> for a single file.",
        "git restore ."
       ]
      },
      "c": "git restore .",
      "re": "^git\\s+restore\\s+\\.\\s*$",
      "note": "You may need to reload the file in the editor to see the restore."
     },
     {
      "f": "Check with git status that the {{working tree}} is clean.",
      "k": {
       "working tree": [
        "After git restore there should be no pending changes left.",
        "git status"
       ]
      },
      "c": "git status",
      "re": "^git\\s+status\\s*$",
      "so": [
       "On branch main",
       "nothing to commit, working tree clean"
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-6",
    "t": "Checking Out Previous Commits",
    "orig": "Checking Out Previous Commits",
    "lvl": 3,
    "tr": "Go back to the first commit (the \"Started project.\" one) to see the original state of the project, then return to the main branch with <code>git switch -</code>. Checking out a commit puts Git in a \"detached HEAD state\".",
    "steps": [
     {
      "f": "Find the {{hash}} of the first commit with git log.",
      "k": {
       "hash": [
        "The history shows the hash (the first 6 characters) of each commit.",
        "git log --pretty=oneline"
       ]
      },
      "c": "git log --pretty=oneline",
      "re": "^git\\s+log\\s+--pretty=oneline\\s*$",
      "so": [
       "cea13dd... Started project."
      ]
     },
     {
      "f": "Perform the {{checkout}} of the commit (the first 6 characters of the hash).",
      "k": {
       "checkout": [
        "<code>git checkout abc123</code> moves HEAD to the specified commit. Watch out: you enter a \"detached HEAD state\".",
        "git checkout cea13d"
       ]
      },
      "c": "git checkout cea13d",
      "re": "^git\\s+checkout\\s+[0-9a-f]{6}\\s*$",
      "so": [
       "Note: switching to 'cea13d'.",
       "HEAD is now at cea13d Started project."
      ]
     },
     {
      "f": "Return to the {{main}} branch with git switch -.",
      "k": {
       "main": [
        "<code>git switch -</code> undoes the previous checkout and takes you back to the branch you were on before (main).",
        "git switch -"
       ]
      },
      "c": "git switch -",
      "re": "^git\\s+switch\\s+-\\s*$",
      "so": [
       "Previous HEAD position was cea13d Started project.",
       "Switched to branch 'main'"
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-7",
    "t": "Reset Hard",
    "orig": "Reset Hard",
    "lvl": 3,
    "tr": "Go back permanently to the \"Started project.\" commit, discarding the one after it. The <code>git reset --hard</code> command is destructive: it deletes commits and changes beyond recovery. Use it with care.",
    "steps": [
     {
      "f": "Check the current {{history}}.",
      "k": {
       "history": [
        "Before a destructive reset, always check what you are about to lose.",
        "git log --pretty=oneline"
       ]
      },
      "c": "git log --pretty=oneline",
      "re": "^git\\s+log\\s+--pretty=oneline\\s*$",
      "so": [
       "945fa13... Extended greeting.",
       "cea13dd... Started project."
      ]
     },
     {
      "f": "Run the {{reset}} to the commit you want to keep.",
      "k": {
       "reset": [
        "<code>git reset --hard abc123</code> moves HEAD to the given commit and deletes everything after it. Irreversible without the reflog.",
        "git reset --hard cea13d"
       ]
      },
      "c": "git reset --hard cea13d",
      "re": "^git\\s+reset\\s+--hard\\s+[0-9a-f]{6}\\s*$",
      "so": [
       "HEAD is now at cea13d Started project."
      ]
     },
     {
      "f": "Check that the {{log}} contains only the first commit.",
      "k": {
       "log": [
        "After the reset, git log shows a single commit.",
        "git log --pretty=oneline"
       ]
      },
      "c": "git log --pretty=oneline",
      "re": "^git\\s+log\\s+--pretty=oneline\\s*$",
      "so": [
       "cea13dd... Started project."
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   },
   {
    "id": "21-8",
    "t": "Deleting the Repository",
    "orig": "Deleting the Repository",
    "lvl": 2,
    "tr": "When the history is beyond recovery, you can delete the <code>.git</code> folder and start over from scratch. This leaves your current files untouched but loses the entire history. Then re-initialize, add, and commit.",
    "steps": [
     {
      "f": "Delete the {{.git}} folder.",
      "k": {
       ".git": [
        "On macOS/Linux: <code>rm -rf .git</code>. On Windows: <code>rmdir /s .git</code> or <code>del .git</code>. This is a destructive operation.",
        "rm -rf .git"
       ]
      },
      "c": "rm -rf .git",
      "re": "^rm\\s+-rf\\s+\\.git\\s*$",
      "so": [
       "(the .git folder no longer exists)"
      ]
     },
     {
      "f": "Check that it is no longer a {{repository}}.",
      "k": {
       "repository": [
        "<code>git status</code> should now say \"fatal: Not a git repository\".",
        "git status"
       ]
      },
      "c": "git status",
      "re": "^git\\s+status\\s*$",
      "so": [
       "fatal: Not a git repository (or any of the parent directories): .git"
      ]
     },
     {
      "f": "Re-initialize, add, and {{commit}} from scratch.",
      "k": {
       "commit": [
        "<code>git init</code> + <code>git add .</code> + <code>git commit -m \"...\"</code>. Start over with a clean history.",
        "git init\ngit add .\ngit commit -m \"Starting over.\""
       ]
      },
      "c": "git init\ngit add .\ngit commit -m \"Starting over.\"",
      "re": [
       "^git\\s+init\\s*$",
       "^git\\s+add\\s+\\.\\s*$",
       "^git\\s+commit\\s+-m\\s+[\"'].+[\"']\\s*$"
      ],
      "so": [
       "Initialized empty Git repository",
       "[main (root-commit)] Starting over."
      ]
     }
    ],
    "noRun": "shell",
    "ch": 21
   }
  ]
 },
 {
  "n": 22,
  "t": "Deployment and Troubleshooting",
  "sub": "Hosting, CLI, logs, and security in production",
  "concepts": [
   "The 8 phases of deployment",
   "Installing the Platform.sh CLI",
   "Reading the output log",
   "DEBUG=False in production",
   "Choosing a host"
  ],
  "ex": [
   {
    "id": "22-1",
    "t": "Deployment Phases",
    "orig": "Deployment Phases",
    "lvl": 1,
    "tr": "Deployment is the process of moving a project from your computer to a remote server. According to Appendix E, it consists of 8 phases. List them and explain each phase in one sentence.",
    "steps": [
     {
      "f": "List the {{8 phases}} of deployment.",
      "k": {
       "8 phases": [
        "From creating the virtual server all the way to routing requests — 1. Create a virtual server; 2. Establish the local-remote connection; 3. Copy the code; 4. Install the dependencies; 5. Configure the database + migrations; 6. Copy the static files; 7. Start the server; 8. Route the requests.",
        "1. Creare un server virtuale\n2. Stabilire connessione locale-remoto\n3. Copiare il codice\n4. Installare le dipendenze\n5. Configurare il database + migrazioni\n6. Copiare i file statici\n7. Avviare il server\n8. Instradare le richieste"
       ]
      },
      "c": null,
      "ta": "List the 8 phases of deployment (min 50 characters)…",
      "min": 50
     },
     {
      "f": "Explain why deployment can {{fail}} even when the local project works.",
      "k": {
       "fail": [
        "The remote server has a different OS, a different filesystem, a different interpreter. Even one dependency missing from requirements.txt can bring the whole deployment down.",
        "e.g. \"The server does not know which packages to install without requirements.txt\""
       ]
      },
      "c": null,
      "ta": "Why can a project that works locally fail once it is online? (min 20 characters)…",
      "min": 20
     }
    ],
    "ch": 22
   },
   {
    "id": "22-2",
    "t": "Installing the CLI",
    "orig": "Installing the CLI",
    "lvl": 2,
    "tr": "Install the Platform.sh CLI on your operating system. The macOS/Linux command uses curl to download the installer and php to run it.",
    "steps": [
     {
      "f": "Download and run the {{installer}} with curl and php.",
      "k": {
       "installer": [
        "<code>curl -fsS</code> downloads in silent mode; <code>| php</code> runs the file with the PHP interpreter. The CLI is written in PHP.",
        "curl -fsS https://platform.sh/cli/installer | php"
       ]
      },
      "c": "curl -fsS https://platform.sh/cli/installer | php",
      "re": "^curl\\s+-fsS\\s+https://platform\\.sh/cli/installer\\s*\\|\\s*php\\s*$",
      "note": "On Windows: use WSL or Git Bash + XAMPP for PHP. On macOS: run <code>brew install php</code> first."
     },
     {
      "f": "Check that the CLI works with {{platform list}}.",
      "k": {
       "platform list": [
        "<code>platform list</code> shows all the available subcommands. If you see the list, the installation worked.",
        "platform list"
       ]
      },
      "c": "platform list",
      "re": "^platform\\s+list\\s*$",
      "so": [
       "Platform.sh CLI commands",
       "..."
      ]
     },
     {
      "f": "Describe how you solved any {{problems}} during the installation.",
      "k": {
       "problems": [
        "It depends on the OS — Windows needs WSL or Git Bash; macOS needs PHP; Linux needs curl and php-cli.",
        "e.g. \"On macOS I had to install Homebrew first and then run brew install php\""
       ]
      },
      "c": null,
      "ta": "How did you install the CLI on your system? (min 20 characters)…",
      "min": 20
     }
    ],
    "noRun": "shell",
    "ch": 22
   },
   {
    "id": "22-3",
    "t": "Reading Error Logs",
    "orig": "Reading Error Logs",
    "lvl": 2,
    "tr": "During a push to Platform.sh, the log can contain many errors. The trick is to read the **first** and **last** errors, because the ones in the middle are often just \"noise\" from internal packages. Here is a real example:",
    "steps": [
     {
      "f": "Look at this log excerpt. What is the main {{error}}?",
      "k": {
       "error": [
        "Look for ERROR (in uppercase) or \"No matching distribution\".",
        "W: ERROR: Could not find a version that satisfies the requirement gunicorn"
       ]
      },
      "c": null,
      "ta": "What is the main error in this log, and what does it mean? (min 20 characters)…",
      "min": 20
     },
     {
      "f": "Point out which {{file}} needs to be fixed.",
      "k": {
       "file": [
        "The error is a missing or misspelled dependency. Which file lists the project's dependencies?",
        "requirements_remote.txt (or requirements.txt)"
       ]
      },
      "c": null,
      "ta": "Which file contains the problematic dependency? (min 10 characters)…",
      "min": 10
     },
     {
      "f": "The fix: {{gunicorn}} (a single 'r') in the dependencies file.",
      "k": {
       "gunicorn": [
        "A typical error: writing \"gunicorn\" as \"gunicorn\". It sounds absurd, but it happens often.",
        "gunicorn==20.1.0  # in the requirements_remote.txt file"
       ]
      },
      "c": "gunicorn==20.1.0",
      "re": "^gunicorn==\\d+\\.\\d+\\.\\d+.*$"
     }
    ],
    "noRun": "django",
    "ch": 22
   },
   {
    "id": "22-4",
    "t": "DEBUG False in Production",
    "orig": "DEBUG False in Production",
    "lvl": 2,
    "tr": "When DEBUG=True, Django shows detailed error pages that reveal the project's structure, files, and paths. On a live site this is a security problem. Set DEBUG=False only in the Platform.sh section of settings.py.",
    "steps": [
     {
      "f": "Find the Platform.sh {{config}} section in settings.py.",
      "k": {
       "config": [
        "The section starts with <code>if config.is_valid_platform():</code>. Only the production settings are changed there.",
        "if config.is_valid_platform():\n    ALLOWED_HOSTS.append(\"platform.sh.site\")"
       ]
      },
      "c": "if config.is_valid_platform():\n    ALLOWED_HOSTS.append(\"platform.sh.site\")",
      "re": [
       "^if\\s+\\w+(\\.\\w+)+\\(\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\s*[\"\\'].+[\"\\']\\s*\\)$"
      ]
     },
     {
      "f": "Add {{DEBUG=False}} inside the if block.",
      "k": {
       "DEBUG=False": [
        "In production, DEBUG must be False. Locally it stays True so you can still see tracebacks.",
        "if config.is_valid_platform():\n    ALLOWED_HOSTS.append(\"platform.sh.site\")\n    DEBUG = False"
       ]
      },
      "c": "if config.is_valid_platform():\n    ALLOWED_HOSTS.append(\"platform.sh.site\")\n    DEBUG = False",
      "re": [
       "^if\\s+\\w+(\\.\\w+)+\\(\\)\\s*:$",
       "^\\w+\\.\\w+\\(\\s*[\"\\'].+[\"\\']\\s*\\)$",
       "^DEBUG\\s*=\\s*False$"
      ]
     },
     {
      "f": "Test the {{change}} with a nonexistent URL.",
      "k": {
       "change": [
        "Visit /topics/999/ on your live site (e.g. with <code>curl -I https://your-project.platform.sh/topics/999/</code>). With DEBUG=False you see a plain 404 with no details; with DEBUG=True you see the technical page.",
        "curl -I https://your-project.platform.sh/topics/999/"
       ]
      },
      "c": null,
      "btn": "✓ Behavior verified in production"
     }
    ],
    "noRun": "django",
    "ch": 22
   },
   {
    "id": "22-5",
    "t": "Choosing a Host",
    "orig": "Choosing a Host",
    "lvl": 1,
    "tr": "There are many approaches to deployment: Platform.sh (CLI or browser), GitHub + deploy hooks, a VPS (DigitalOcean, Linode), AWS/Azure (complex services). Choose a provider and describe the deployment workflow.",
    "steps": [
     {
      "f": "List the {{provider}} options you considered.",
      "k": {
       "provider": [
        "Compare at least 2-3 options, considering cost, simplicity, and scalability — e.g. Platform.sh, Render, Railway, Fly.io, or a VPS on DigitalOcean.",
        "Platform.sh, Render, Railway, Fly.io, VPS on DigitalOcean"
       ]
      },
      "c": null,
      "ta": "Which hosting options did you consider, and why? (min 30 characters)…",
      "min": 30
     },
     {
      "f": "Describe the {{flow}} of deployment for the provider you chose.",
      "k": {
       "flow": [
        "E.g. \"git push origin main → GitHub deploy hook → automatic build on Render → live in 2 minutes\"",
        "e.g. \"platform push\" → build → deploy in 3-5 minutes"
       ]
      },
      "c": null,
      "ta": "Describe the deployment workflow of the provider you choose. (min 30 characters)…",
      "min": 30
     },
     {
      "f": "Reflection: {{when}} is a \"simple\" host worth it, instead of a complex one?",
      "k": {
       "when": [
        "A hint from Appendix E: it is better to have a simple, reliable host that serves thousands of requests per minute than infrastructure designed for millions of users when nobody is visiting your site.",
        "e.g. \"For a school project, a free-tier host is enough\""
       ]
      },
      "c": null,
      "ta": "When is a simple host enough? (min 20 characters)…",
      "min": 20
     }
    ],
    "ch": 22
   }
  ]
 }
];

/* ---------------- ROADMAP · modules not included in the provided PDFs ---------------- */
const ROADMAP = [];

/* ---------------- Lookup maps ---------------- */
const EX = {}; const ORDER = [];
CH.forEach(c => c.ex.forEach(e => { e.ch = c.n; EX[e.id] = e; ORDER.push(e.id); }));
const TOTAL_EX = ORDER.length;

/* ---------------- Module exports ---------------- */
export { CH, EX, ORDER, TOTAL_EX, ROADMAP };

/** Find an exercise by id ("2-3"). */
export function trovaEsercizio(id) {
  return EX[id] || null;
}

/** Code accumulated by the user for an exercise (line by line).
 *  st = {solved, lines?: {idx: lines written by the user (canonical indentation)}}
 *  Steps without `c` (exploratory/reflection) do not contribute to the program.
 *  Fallback: for sessions born with the monolith (without lines), the expected code is used. */
export function codiceEsercizio(ex, st, opts) {
  opts = opts || {};
  const progress = opts.progress || {};
  const includePrereq = opts.includePrereq !== false;
  const out = [];

  // 1. Prerequisite code (if active and if the exercise has prereq)
  if (includePrereq && ex.prereq) {
    const prereqs = Array.isArray(ex.prereq) ? ex.prereq : [ex.prereq];
    prereqs.forEach(pid => {
      const pex = EX[pid];
      if (!pex) return;
      const pst = progress[pid] || { solved: 0, lines: {} };
      pex.steps.forEach((s, i) => {
        if (!s.c) return;
        const line = (pst.lines && pst.lines[i] && i < pst.solved)
          ? pst.lines[i]
          : s.c;
        out.push(line);
      });
    });
  }

  // 2. Current exercise code (only steps with c, up to solved)
  ex.steps.forEach((s, i) => {
    if (!s.c || i >= st.solved) return;
    const user = (st.lines && st.lines[i]) ? st.lines[i] : s.c;
    out.push(user);
  });

  return out.join('\n');
}
