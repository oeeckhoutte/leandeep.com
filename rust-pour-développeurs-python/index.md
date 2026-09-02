# Rust pour développeurs Python

- Canonical URL: https://leandeep.com/rust-pour-d%C3%A9veloppeurs-python/
- Author: Olivier Eeckhoutte
- Published: 2022-10-23T07:49:00+02:00
- Updated: 2022-10-23T07:49:00+02:00
- Language: fr
- Tags: Rust
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit guide rapide pour les `Pythonistas` souhaitant devenir `Rustaceans`.

<br/>



<div style="width: 100%; float: left; position: relative;">
  
  <div style="float: left; width: 49%;">
    <div style="width:100%; text-align: center;"><b><u>Python</u></b></div>
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>1. Conventions et guidelines</b>
      <br/>
      <a href="https://www.python.org/dev/peps/pep-0008/">PEP8</a>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>2. Tooling</b>
      <br/>
      <ul>
      <li>requirements.txt</li>
      <li>setup.py</li>
      <li><a href="https://pypi.org/">PyPI</a></li>
      <li><a href="https://pypi.python.org/pypi/pip">pip</a></li>
      <li><a href="https://pypi.python.org/pypi/setuptools">setuptools</a> & <a href="https://python-poetry.org/">poetry</a> pour distribuer des libs</li>
      <li><a href="https://pypi.python.org/pypi/pipenv">pipenv</a> pour la gestion des dépendances</li>
      <li><a href="https://pypi.python.org/pypi/twine">twine</a> pour uploader un package</li>
      <li>venv pour isoler un env</li>
      <li><a href="https://github.com/pyenv/pyenv-installer">pyenv</a> pour gérer ≠ versions de Python</li>
      <li><a href="https://docs.python.org/library/pydoc.html">pydoc</a> & <a href="https://pypi.python.org/pypi/sphinx">Sphinx</a> pour générer la doc</li>
      <li>Python pour interpréter/ compiler</li>
      <li><a href="https://pypi.python.org/pypi/ipython">ipython</a> comme REPL</li>
      <li><a href="https://pypi.python.org/pypi/ipdb">ipdb</a> pour debugguer</li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>3. Librairies et frameworks</b>
      <br/>
      <ul>
      <li>urllib</li>
      <li>requests</li>
      <li>json</li>
      <li><a href="https://pypi.python.org/pypi/pyyaml">pyYAML</li>
      <li>csv</li>
      <li>datetime & <a href="https://pypi.python.org/pypi/dateutils">dateutils</a></li>
      <li><a href="https://pypi.python.org/pypi/click">click</a> & <a href="https://pypi.python.org/pypi/argparse">argparse</a></li>
      <li><a href="https://pypi.python.org/pypi/docopt"></a>docopt</li>
      <li>re</li>
      <li>subprocess</li>
      <li>multiprocessing</li>
      <li>logging</li>
      <li>pathlib</li>
      <li>pickle</li>
      <li>heapq</li>
      <li>flask</li>
      <li><a href="https://pypi.python.org/pypi/cryptography">cryptography</a></li>
      <li><a href="https://pypi.python.org/pypi/pymongo">pymongo</a></li>
      <li><a href="https://pypi.python.org/pypi/jinja2">jinja2</a></li>
      <li><a href="http://www.pyside.org/">pyside</a></li>
      <li>pytest</li>
      <li>Flake8</li>
      <li>Black</li>
      <li>itertools</li>
      <li>celery</li>
      <li>boto</li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>4. Python like features</b>
      <br/>
      <ul>
      <li>dict</li>
      <li>constructor avec valeurs par défaut</li>
      <li>itertools</li>
      <li>hashlib</li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>5. Hello world</b>
      <pre style="margin: 0px; padding: 5px;">
<code>if __name__ == "__main__":
    print("Hello, World")</code>
</pre>
    </div>
    <br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>6. Types</b>
      <pre style="margin: 0px; padding: 5px;">
<code>age = 33
name = 'olivier'
weight = 75.3
cartoons = ['riri', 'fifi', 'loulou']
ages = {
    'riri': 7,
    'fifi': 7,
    'loulou': 7,
}</code>
</pre>
    </div>
    <br/><br/><br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>7. Fonctions</b>
      <pre style="margin: 0px; padding: 5px;">
<code>def substract(a: int, b: int) -> int:
    """Substracts b from a"""
    return a - b</code>
</pre>
    </div>
    <br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>8. Manipulation de listes</b>
      <pre style="margin: 0px; padding: 5px;">
<code>

cartoons = ["riri", "fifi", "loulou"]
print(cartoons[0])  # riri
cartoons.append("donald")
print(len(cartoons))  # 4
print(cartoons[2:])  # ["loulou", "donald"]

for cartoon in cartoons:
    print(cartoon)

for i, cartoon in enumerate(cartoons):
    print(f"{cartoon} at {i}")

# Lexicographical order
cartoons.sort()

# Reversed lexicographical order
cartoons.sort(reverse=True)

# Sort by length
cartoons.gpg(key=len)</code>
</pre>
    </div>
    <br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>9. Range</b>
      <pre style="margin: 0px; padding: 5px;">
<code>for i in range(0,6,2):
   print(i) # 0, 2, 4
    </code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>10. Manipulation de dictionnaires (hash map)</b>
      <pre style="margin: 0px; padding: 5px;">
<code># Create new dict
cartoons_age = {}
cartoons_age["riri"] = 7
cartoons_age["fifi"] = 7
cartoons_age["loulou"] = 7

# or using for loop
cartoons_age = {}
for cartoon, age in [("riri", 7), ("fifi", 7), ("loulou", 7)]:
    cartoons_age[cartoon] = age

# or using a list
cartoons_age = dict([("riri", 7), ("fifi", 7), ("loulou", 7)])

# or using key values
cartoons_age = {
    "riri": 7,
    "fifi": 7,
    "loulou": 7,
}

cartoons_age["donald"] = 45
print(cartoons_age["riri"])  # 7
print("riri" in cartoons_age)  # True

del cartoons_age["loulou"]

for cartoon in cartoons_age:  # Keys
    print(cartoon)

for cartoon, age in cartoons_age.items():  # Keys & values
    print(f"{cartoon} is {age} years old")</code>
</pre>
    </div>
    <br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/><br/><br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>11. Lire contenu d'un fichier</b>
      <pre style="margin: 0px; padding: 5px;">
<code>from pathlib import Path

with Path("/tmp/mon_fichier.txt").open() as fp:
    #  Iterate over lines
    for line in fp:
        print(line.strip())</code>
</pre>
    </div>
    <br/><br/><br/><br/><br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>12. Exceptions/ Retour d'erreur</b>
      <pre style="margin: 0px; padding: 5px;">
<code>def div(a, b):
    if b == 0:
        raise ValueError("Division par 0 impossible")
    return a / b

try:
    div(1, 0)
except ValueError:
    print('Oops an error occurred!')</code>
</pre>
    </div>
    <br/><br/><br/><br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>13. "Printer" des objets</b>
      <pre style="margin: 0px; padding: 5px;">
<code>class Cartoon:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __repr__(self):
      return str(self.__dict__)

riri = Cartoon(
    name='Riri',
    age=7,
)

print('{!r}'.format(riri))  
# {'name': 'Riri', 'age': 7}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <br/>
    <div style="width:100%; padding-top: 20px; ">
      <b>14. Set (hashSet)</b>
      <pre style="margin: 0px; padding: 5px;">
<code>
cartoons = set()
cartoons.add("riri")
cartoons.add("fifi")
cartoons.add("loulou")
cartoons.add("loulou")

# or using literal syntax
cartoons = {'riri', 'fifi', 'loulou', 'loulou'}

# or using an iterator
cartoons = set(['riri', 'fifi', 'loulou', 'loulou'])

# Manipulation sur les sets
cartoons = {'riri', 'fifi', 'loulou', 'donald', 'picsou'}
some_cartoons = {"donald", "picsou"}

# difference
print(cartoons.difference(some_cartoons))
# {'riri', 'fifi', 'loulou'}

# intersection
print(cartoons.intersection(some_cartoons))  
# {'donald', picsou}

# union
print(cartoons.union(some_cartoons))
# {'riri', 'fifi', 'loulou', 'donald', 'picsou'}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/>
    <br/>
    <div style="width:100%; padding-top: 20px; ">
      <b>15. while et for loops</b>
      <pre style="margin: 0px; padding: 5px;">
<code># While loop
counter = 0
while counter < 10:
    print(counter)
    counter += 1

# infinite while loop
while True:
    print("Infinite loop")

# infinite while loop with break
counter = 0
while True:
    print(counter)
    counter += 1
    if counter >= 10:
        break


# while loop with continue
counter = 0
while True:
    counter += 1
    if counter == 5:
        continue
    print(counter)
    if counter >= 10:
        break

# For loop over a list
for cartoon in ["riri", "fifi", "loulou"]:
    print(cartoon)

# Enumerating indexes
for  i, cartoon in enumerate(["riri", "fifi", "loulou"]):
    print(f"{cartoon} at index {i}")

# For in a range
for number in range(0, 100):
    print(number)  # from 0 to 99
</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <br/><br/><br/><br/><br/><br/>
    <div style="width:100%; padding-top: 20px; ">
      <b>16. Flask vs Rocket</b>
      <pre style="margin: 0px; padding: 5px;">
<code>from flask import Flask

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello Python'


if __name__ == '__main__':
    app.run(port=8080)
</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>17. Request vs Reqwest</b>
      <pre style="margin: 0px; padding: 5px;">
<code>import requests

url = 'https://httpbin.org/ip'

try:
    resp = requests.get(url)
except HTTPError as err:
    msg = f"error: cannot get {url} - {err}"
    raise SystemExit(msg)

assert resp.status_code == 200

print(f"The response content is: {resp.content}")</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <br/><br/><br/><br/><br/>
    <div style="width:100%; padding-top: 20px; ">
      <b>18. JSON encoding decoding</b>
      <pre style="margin: 0px; padding: 5px;">
<code>import json

# Decode/Deserialize
cartoon_data = '''{
    "name": "riri",
    "age": 7
}'''

cartoon = json.loads(cartoon_data)

# Do things like with any other Python data structure
print(f"{cartoon['name']} was born {cartoon['age']} years ago")

# Encode/Serialize
serialized = json.dumps(obj)
print(f"The serialized value is: {serialized}")</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <br/><br/><br/><br/><br/>
    <br/><br/><br/><br/><br/>
    <br/><br/>
    <div style="width:100%; padding-top: 20px; ">
      <b>19. Object oriented</b>
      <pre style="margin: 0px; padding: 5px;">
<code>class Soldier:
    def __init__(self, name: str):
        self.name = name

    def present(self, other_family_name: str):
        print(f"Hi M. {other}, I'm solider {self.name}")

# ...

soldier = Soldier("Ryan")
soldier.present("Bond")</code>
</pre>
    </div>
    <!-- -->
    <!-- -->

  </div>

  <!-- -->
  <!-- -->
  <!-- -->

  <div style="float: right; width: 49%;">
    <div style="width:100%; text-align: center;"><b><u>Rust</u></b></div>
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>1. Conventions et guidelines</b>
      <br/>
<a href="https://rust-lang-nursery.github.io/api-guidelines/">RustAPI Guidelines</a>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>2. Tooling</b>
      <br/>
      <ul>
      <li>Cargo.toml</li>
      <li>Cargo.toml</li>
      <li><a href="http://crates.io/">Crates.io</a></li>
      <li><a href="http://doc.crates.io/">Cargo</a></li>
      <li><a href="http://doc.crates.io/">Cargo</a></li>
      <li><a href="http://doc.crates.io/">Cargo</a></li>
      <li><a href="http://doc.crates.io/">Cargo</a> & <a href="https://github.com/semantic-rs/semantic-rs">Semantic</a></li>
      <li><a href="http://doc.crates.io/">Cargo</a></li>
      <li><a href="https://www.rustup.rs/">Rustup</a></li>
      <li><a href="https://doc.rust-lang.org/stable/rustdoc/">Rustdoc</a> & Cargo</li>
      <li><a href="https://doc.rust-lang.org/1.1.0/rustc/">rustc</a> & Cargo</li>
      <li><a href="https://github.com/murarth/rusti">rusti</a></li>
      <li><a href="https://github.com/rust-lang/rust/blob/master/src/etc/rust-gdb">rust-gdb</a></li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>3. Librairies et frameworks</b>
      <br/>
      <ul>
      <li><a href="https://crates.io/crates/hyper">hyper</a></li>
      <li><a href="https://github.com/seanmonstar/reqwest">reqwest</a></li>
      <li><a href="https://github.com/serde-rs/serde">serde</a></li>
      <li><a href="https://github.com/serde-rs/serde">serde</a></li>
      <li><a href="https://github.com/BurntSushi/rust-csv">rust-csv</a></li>
      <li><a href="https://github.com/chronotope/chrono">Chrono</a></li>
      <li><a href="https://github.com/kbknapp/clap-rs">clap</a></li>
      <li><a href="https://github.com/docopt/docopt.rs">docopt</a></li>
      <li><a href="https://github.com/rust-lang/regex">regex</a></li>
      <li><a href="https://crates.io/crates/subprocess">subprocess</a></li>
      <li><a href="https://crates.io/crates/rayon">Rayon</a></li>
      <li><a href="https://github.com/rust-lang-nursery/log">log</a></li>
      <li><a href="https://doc.rust-lang.org/std/fs/">fs</a> & <a href="https://github.com/webdesus/fs_extra">fs_extra</a></li>
      <li><a href="https://github.com/ron-rs/ron">RON</a></li>
      <li>BinaryHeap</li>
      <li><a href="https://github.com/SergioBenitez/Rocket">Rocket</a></li>
      <li><a href="https://github.com/DaGenix/rust-crypto">crypto</a></li>
      <li><a href="https://crates.io/keywords/mongodb">mongodb</a></li>
      <li><a href="https://github.com/Keats/tera">Tera</a></li>
      <li><a href="https://github.com/rust-qt">rust-qt</a></li>
      <li><a href="https://github.com/AlKass/polish">polish</a></li>
      <li><a href="https://github.com/rust-lang-nursery/rust-clippy">Clippy</a></li>
      <li>rustfmt</li>
      <li><a href="https://github.com/bluss/rust-itertools">rust-itertools</a></li>
      <li><a href="https://github.com/antimonyproject/antimony">antimony</a></li>
      <li><a href="https://github.com/rusoto/rusoto">rusoto</a></li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>4. Python like features</b>
      <br/>
      <ul>
      <li><a href="https://crates.io/crates/maplit">maplit</a></li>
      <li><a href="https://github.com/nrc/derive-new">derive_new</a></li>
      <li><a href="https://crates.io/crates/itertools">itertools</a></li>
      <li><a href="https://github.com/libpasta/libpasta">libpasta</a></li>
      </ul>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>5. Hello world</b>
      <pre style="margin: 0px; padding: 5px;">
<code>fn main() {
  println!("Hello, World");
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>6. Types</b>
      <pre style="margin: 0px; padding: 5px;">
<code>use std::collections::HashMap;

fn main() {
    let age = 33;
    let name = "olivier";
    let weight = 75.3;
    let mut cartoons = vec!["riri", "fifi", "loulou"];

    let mut ages = HashMap::new();
    ages.insert("riri", 7);
    ages.insert("fifi", 7);
    ages.insert("loulou", 7);
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>7. Fonctions</b>
      <pre style="margin: 0px; padding: 5px;">
<code>/// Substracts b from a
fn substract(a: i32, b: i32) -> i32 {
  a - b
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>8. Manipulation de listes</b>
      <pre style="margin: 0px; padding: 5px;">
<code>fn main() {
    let mut cartoons = vec!["riri", "fifi", "loulou"];
    println!("{}", cartoons[0]);  // riri
    cartoons.push("donald");
    println!("{}", cartoons.len());  // 4
    println!("{:?}", &cartoons[2..]);  // ["loulou", "donald"]

    for cartoon in &cartoons {
        println!("{}", cartoon);
    }

    for (i, cartoon) in cartoons.iter().enumerate() {
        println!("{} at {}", i, cartoon);
    }

    // Lexicographical order
    cartoons.sort();

    // Reversed lexicographical order
    cartoons.sort_by(|a, b| b.cmp(a));

    // Sort by length
    cartoons.sort_by_key(|a| a.len());
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>9. Range</b>
      <pre style="margin: 0px; padding: 5px;">
<code>for i in (0..6).step_by(2) {
    println!("{}", i);  // 0, 2, 4
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>10. Manipulation de dictionnaires (hash map)</b>
      <pre style="margin: 0px; padding: 5px;">
<code>use std::iter::FromIterator;
use std::collections::HashMap;

fn main() {

    // Create new HashMap
    let mut cartoons_ages = HashMap::new();
    cartoons_ages.insert("riri", 7);
    cartoons_ages.insert("fifi", 7);
    cartoons_ages.insert("loulou", 7);

    // or using a loop
    let mut cartoons_ages = HashMap::new();
    for &(name, age) in [("riri", 7), ("fifi", 7), ("loulou", 7)].iter() {
        // Possible to remove & and use iter().clone()
        cartoons_ages.insert(name, age);
    }

    // or using an Array
    let mut cartoons_ages: HashMap<&str, i32> =
        [("riri", 7), 
         ("fifi", 7), 
         ("loulou", 7)]
        .iter().cloned().collect();

    // or using a Vec (Iterator)
    let mut cartoons_ages: HashMap<&str, i32> =
        HashMap::from_iter(
            vec![
               ("riri", 7),
               ("fifi", 7),
               ("taz", 7)
            ]
        );

    cartoons_ages.insert("donald", 45);
    println!("{}", cartoons_ages["fifi"]);  // 7
    println!("{}", cartoons_ages.contains_key("fifi")); // true
    cartoons_ages.remove("loulou");


    for name in cartoons_ages.keys() {  // Keys
      println!("{}", name);
    }

    for (name, age) in &cartoons_ages {  // Keys & values
      println!("{} is {} years old", name, age);
    }

}</code>
</pre>
    <br/><b>Alternative</b>
    <br/>
    Ajouter la dependency dans Cargo.toml
<pre style="margin: 0px; padding: 5px;">
<code>[dependencies]
maplit = "*"
</code></pre>
<br/>
Puis utiliser juste:
<pre style="margin: 0px; padding: 5px;">
<code>#[macro_use] extern crate maplit;

let map = hashmap!{
    "riri" => 7,
    "fifi" => 7,
    "loulou" => 7,
};</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>11. Lire contenu d'un fichier</b>
      <pre style="margin: 0px; padding: 5px;">
<code>use std::io::{BufReader, BufRead};
use std::fs::File;
use std::path::Path;

fn main () {
    let fp = File::open(Path::new("/tmp/mon_fichier.txt")).unwrap();
    let file = BufReader::new(&fp);
    for line in file.lines() {
        //  Iterate over lines
        println!("{}", line.unwrap());
    }
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>12. Exceptions/ Retour d'erreur</b>
      <pre style="margin: 0px; padding: 5px;">
<code>fn div(a: f64, b: f64) -> Result<f64, &'static str> {
    if b == 0 {
        Err("Division par 0 impossible")
    } else {
        Ok(a / b)
    }
}

fn main() {
    match div(1, 0) {
        Ok(_) => {},
        Err(_) => println!("Oops an error occurred!"),
    };
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>13. "Printer" des objets</b>
      <pre style="margin: 0px; padding: 5px;">
<code>#[derive(Debug)]
struct Cartoon {
    name: String,
    age: i32
}

fn main() {
    let riri = Cartoon {name: "Riri".into(), age: 7};
    println!("{:#?}", riri);
    // Actor {name: "Riri", age: 7 }
}
</code>
</pre>
    </div>
    <br/><br/><br/>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>14. Set (hashSet)</b>
      <pre style="margin: 0px; padding: 5px;">
<code>use std::collections::HashSet;
use std::iter::FromIterator;

fn main() {
    let mut cartoons = HashSet::new();
    cartoons.insert("riri");
    cartoons.insert("fifi");
    cartoons.insert("loulou");
    cartoons.insert("loulou");

    // from an iterator
    let mut cartoons: HashSet<&str> = HashSet::from_iter(vec!["riri", "fifi", "loulou", "loulou"]);

    // deduplication
    println!("{:?}", cartoons); 
    // {"riri", "fifi", "loulou"}

    // Manipulation sur les hashSet
    let mut cartoons: HashSet<&str> = HashSet::from_iter(vec!["riri", "fifi", "loulou", "loulou", "donald", "picsou"]);
    let mut some_cartoons: HashSet<&str> = HashSet::from_iter(vec!["donald", "picsou"]);

    // difference
    cartoons.difference(&some_cartoons); 
    // ["riri", "fifi", "loulou"]

    // intersection
    cartoons.intersection(&some_cartoons); 
    // ["riri"]

    // union
    cartoons.union(&some_cartoons); 
    // ["red", "fifi", "loulou, "donald", "picsou"]
}</code>
</pre>
<br/><b>Alternative</b>
    <br/>
    Ajouter la dependency dans Cargo.toml
<pre style="margin: 0px; padding: 5px;">
<code>[dependencies]
maplit = "*"
</code></pre>
<br/>
Puis utiliser juste:
<pre style="margin: 0px; padding: 5px;">
<code>#[macro_use] extern crate maplit;

let cartoons = hashset!{"riri", "fifi", "loulou", "loulou"};</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>15. while et for loops</b>
      <pre style="margin: 0px; padding: 5px;">
<code>fn main() {

    // While loop
    let mut counter = 0;
    while counter < 10 {
        println!("{}", counter);
        counter += 1;
    }

    // infinite while loop
    loop {
        println!("Infinite loop");
    }

    // infinite while loop with break
    let mut counter = 0;
    loop {
        println!("{}", counter);
        counter += 1;
        if counter >= 10 { break; }
    }

    // infinite while loop with continue
    let mut counter = 0;
    loop {
        counter += 1;
        if counter == 5 { continue; }
        println!("{}", counter);
        if counter >= 10 { break; }
    }

    // for loop over a list
    for cartoon in ["riri", "fifi", "loulou"].iter() {
        println!("{}", cartoon);
    }

    // Enumerating indexes
    for (i, cartoon) in ["riri", "fifi", "loulou"].iter().enumerate() {
        println!("{} at index {}", cartoon, i);
    }

    // for in a range
    for number in 0..100 {
        println!("{}", number);  
        // from 0 to 99
    }
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>16. Flask vs Rocket</b>
      <pre style="margin: 0px; padding: 5px;">
<code>#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello Rust"
}

fn main() {
    rocket::ignite().mount("/", routes![index]).launch();
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>17. Request vs Reqwest</b>
      <pre style="margin: 0px; padding: 5px;">
<code>extern crate reqwest;
use std::io::Read;

fn main() {
    let url = "https://httpbin.org/ip";

    let mut resp = match reqwest::get(url) {
        Ok(response) => response,
        Err(e) => panic!("error: could not perform get request {}", e),
    };

    assert!(resp.status().is_success());

    let mut content = String::new();
    resp.read_to_string(&mut content).expect("valid UTF-8");

    println!("The response content is: {}", content);
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>18. JSON encoding decoding</b>
      <pre style="margin: 0px; padding: 5px;">
<code>extern crate serde;
extern crate serde_json;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
struct Cartoon {
    name: String,
    age: u8,
}

fn main() {
    // Decode/Deserialize
    let cartoon_data = r#"{"name": "riri", "age": 7}"#;

    let c: Cartoon = match serde_json::from_str(cartoon_data) {
        Ok(cartoon) => cartoon,
        Err(e) => panic!("error: could not deserialize: {}", e),
    };

    // Do things just like with any other Rust data structure.
    println!("{} was born {} years ago.", c.name, c.age);

    // Encode/Serialize
    let serialized = serde_json::to_string(&c).unwrap();
    println!("The serialized value is: {}", serialized);
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>19. Object oriented</b>
      <pre style="margin: 0px; padding: 5px;">
<code>struct Soldier {
    name: String
}

impl Soldier {

    pub fn new&lt;S>(name: S) -> Soldier where S: Into<String> {
        Soldier { name: name.into() }
    }
    
    pub fn present<S: Into<String>>(&self, other_family_name:S) {
        println!("Hi M. {}, I'm {}", other_family_name.into(), self.name);
    }     
    
}

fn main() {
    let soldier = Soldier::new("Ryan");
    soldier.present("Bond");
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
  </div>

</div>
</div>



