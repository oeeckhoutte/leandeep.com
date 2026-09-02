# ES6 pour développeurs Python

- Canonical URL: https://leandeep.com/es6-pour-d%C3%A9veloppeurs-python/
- Author: Olivier Eeckhoutte
- Published: 2022-02-16T07:49:00+02:00
- Updated: 2022-02-16T07:49:00+02:00
- Language: fr
- Tags: ES6
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour que le code React, et JavaScript plus généralement, ne soit pas trop moche; il faut s'inspirer de Python ahahah...



<div style="width: 100%; float: left; position: relative;">
  
  <div style="float: left; width: 49%;">
    <div style="width:100%; text-align: center;"><b><u>Python</u></b></div>
    <!-- -->
    <div style="width:100%; padding-top: 20px; ">
      <b>1. Variables dans des strings</b>
<pre style="margin: 0px; padding: 5px;">
<code>name = 'olivier'

value = f"""Hello, {name}!
Welcome!"""

price = 7.5
value = f"Prix: {price:.2f} €"
print(value)
# Prix: 7.50 €</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>2. Iterator</b>
<pre style="margin: 0px; padding: 5px;">
<code>for item in ['A', 'B', 'C']: 
  print(item)
  </code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>3. Sets</b>
<pre style="margin: 0px; padding: 5px;">
<code>mon_set = set(['titi']) 
mon_set.add('tata')
mon_set.add('toto')
'titi' in mon_set
len(mon_set) == 3
for elem in mon_set:
  print(elem) 
mon_set.remove('C')</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>4. Generators</b>
<pre style="margin: 0px; padding: 5px;">
<code>def countdown(counter):
 while counter > 0:
  yield counter
  counter -= 1


for counter in countdown(10):
 print(counter)
 </code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>5. Unpacking</b>
<pre style="margin: 0px; padding: 5px;">
<code>a = 1
b = 2
a, b = b, a
first, second, *the_rest = [1, 2, 3, 4]
</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>6. Lambda functions</b>
<pre style="margin: 0px; padding: 5px;">
<code>sum = lambda x, y: x + y 
square = lambda x: x ** 2</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>7. Function arguments</b>
<pre style="margin: 0px; padding: 5px;">
<code>from pprint import pprint

def create_post(**options):
  pprint(options)

def report(post_id, reason='not-relevant'):
  pprint({'post_id': post_id, 'reason': reason}) 

def add_tags(post_id, *tags):
  pprint({'post_id': post_id, 'tags': tags})


create_post(title='Hello, World!', content='') 
report(42)
report(post_id=24, reason='spam')
add_tags(42, 'python', 'javascript', 'django')</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>8. Classes et héritage</b>
<pre style="margin: 0px; padding: 5px;">
<code>class Post:
 def __init__(self, id, title):
  self.id = id
  self.title = title

 def __str__(self):
  return self.title

class Article(Post):
 def __init__(self, id, title, content):
   super(Article, self).__init__(id, title)
   self.content = content

class Link(Post):
 def __init__(self, id, title, url):
  super(Link, self).__init__(id, title)
  self.url = url

 def __str__(self):
  return '{} ({})'.format(
    super(Link, self).__str__(),
    self.url,
  )

article = Article(1, 'Hello, World!',
 'This is my first article.'
)

link = Link(2, 'The Example', 'http://example.com')
# isinstance(article, Post) == True
# isinstance(link, Post) == True
print(link)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>9. Class properties</b>
<pre style="margin: 0px; padding: 5px;">
<code>class Post(object):
 def __init__(self, id, title):
  self.id = id
  self.title = title
  self._slug = ''

 @property
 def slug(self):
  return self._slug

 @slug.setter
 def slug(self, value):
  self._slug = value



post = Post(1, 'Hello, World!')
post.slug = 'hello-world'
print(post.slug)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>10. Liste - tous les éléments vrais</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [1, 2, 3]
all_truthy = all(items)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>11. Liste - au moins un élément vrai</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3]
some_truthy = any(items)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>12. Liste - itérer sur tous les éléments</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = ['a', 'b', 'c', 'd']

for index, element in enumerate(items):
 print(f'{index}: {element};')</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>13. Liste - Map</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3]
all_doubled = list(
 map(lambda x: 2 * x, items)
)
# [0, 2, 4, 6]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>14. Liste - Filtrer les éléments avec une fonction</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3]
only_even = list(
 filter(lambda x: x % 2 == 0, items)
)
# [0, 2]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>15. Liste - Reduce avec une fonction</b>
<pre style="margin: 0px; padding: 5px;">
<code>from functools import reduce

items = [1, 2, 3, 4]
total = reduce(
    lambda total, current: total + current,
items, )
# 10</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>16. Fusionner des dicts</b>
<pre style="margin: 0px; padding: 5px;">
<code>d1 = {'a': 'A', 'b': 'B'}
d2 = {'a': 'AAA', 'c': 'CCC'}
merged = {**d1, **d2} # since Python 3.5
# {'a': 'AAA', 'b': 'B', 'c': 'CCC'}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>17. Parse int</b>
<pre style="margin: 0px; padding: 5px;">
<code>number = int(text)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>18. One liner/ Opérateur ternaire</b>
<pre style="margin: 0px; padding: 5px;">
<code>value = 'ADULT' if age >= 18 else 'CHILD'</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>19. Object attribute</b>
<pre style="margin: 0px; padding: 5px;">
<code>attribute = 'color'
value = getattr(obj, attribute, 'GREEN') 
setattr(obj, attribute, value)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>20. Dictionnaire value by key</b>
<pre style="margin: 0px; padding: 5px;">
<code>key = 'color'
value = dictionary.get(key, 'GREEN')
dictionary[key] = value</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>21. Slice</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [1, 2, 3, 4, 5]
first_two = items[:2] 
# [1, 2]
last_two = items[-2:]
# [4, 5] 
middle_three = items[1:4]
# [2, 3, 4]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>22. Opération sur les listes</b>
<pre style="margin: 0px; padding: 5px;">
<code>items1 = ['A']
items2 = ['B']
items = items1 + items2 
items.append('C') 
items.insert(0, 'D') 
first = items.pop(0) 
last = items.pop() 
items.delete(0)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>23. Joining lists of strings</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = ['A', 'B', 'C']
text = ', '.join(items) # 'A, B, C'</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>24. JSON</b>
<pre style="margin: 0px; padding: 5px;">
<code>import json
json_data = json.dumps(dictionary, indent=4) 
dictionary = json.loads(json_data)</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>25. Error handling</b>
<pre style="margin: 0px; padding: 5px;">
<code>class CustomException(Exception): 
  def __init__(self, message):
    self.message = message 
  
  def __str__(self):
    return self.message 

def proceed():
  raise CustomException('Error happened!')

try: 
  proceed()
except CustomException as err: 
  print(f'Sorry! {err}')
finally: 
  print('Finishing')
  


  </code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>26. Import</b>
<pre style="margin: 0px; padding: 5px;">
<code>import math
print(math.log(42))

from math import log
print(log(42))

from math import *
print(log(42))</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>27. Range</b>
<pre style="margin: 0px; padding: 5px;">
<code>print(range(5))</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>28. Comprehensions</b>
<pre style="margin: 0px; padding: 5px;">
<code>names = [c.name for c in friends if c.friendly]
</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>29. Dict creation</b>
<pre style="margin: 0px; padding: 5px;">
<code>x = 42
y = 43
mon_dict = {"x": x, "y": y}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>30. String in list</b>
<pre style="margin: 0px; padding: 5px;">
<code>my_list = ["titi", "tata", "toto"]
if "titi" in my_list:
    print("ok")</code>
</pre>
    </div>
    <!-- -->

  </div>

  <!-- -->
  <!-- -->
  <!-- -->

  <div style="float: right; width: 49%;">
    <div style="width:100%; text-align: center;"><b><u>ES6</u></b></div>
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>1. Variables dans des strings</b>
<pre style="margin: 0px; padding: 5px;">
<code>name = 'olivier';

value = `Hello, ${name}!
Welcome!`;

price = 7.5;
value = `Prix ${price.toFixed(2)} €`;
console.log(value);
// 'Price: 7.50</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>2. Iterator</b>
<pre style="margin: 0px; padding: 5px;">
<code>for (let item of ['A', 'B', 'C']) { 
  console.log(item);
}</code>
</pre>
    </div>
      <!-- -->
      <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>3. Sets</b>
<pre style="margin: 0px; padding: 5px;">
<code>mon_set = new Set(['titi']);
mon_set.add('tata').add('toto');
mon_set.has('titi') === true;
mon_set.size === 3;
for (let elem of mon_set.values()) {
  console.log(elem);
} 
mon_set.delete('C');</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>4. Generators</b>
<pre style="margin: 0px; padding: 5px;">
<code>function* countdown(counter) {
 while (counter > 0) {
  yield counter;
  counter--;
 }
}
for (let counter of countdown(10)) {
 console.log(counter);
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>5. Unpacking</b>
<pre style="margin: 0px; padding: 5px;">
<code>a = 1;
b = 2;
[a, b] = [b, a];
[first, second, ...the_rest] = [1, 2, 3, 4];</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>6. Lambda functions</b>
<pre style="margin: 0px; padding: 5px;">
<code>sum = (x, y) => x + y;
square = x => Math.pow(x, 2);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>7. Function arguments</b>
<pre style="margin: 0px; padding: 5px;">
<code>function create_post(options) {
  console.log(options); 
}

function report(post_id, reason='not-relevant') { 
  console.log({post_id: post_id, reason: reason});
}

function add_tags(post_id, ...tags) { 
  console.log({post_id: post_id, tags: tags});
}

create_post({title: 'Hello, World!', content': ''}); 
report(42);
report(post_id=24, reason='spam');
add_tags(42, 'python', 'javascript', 'django');</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>8. Classes et héritage</b>
<pre style="margin: 0px; padding: 5px;">
<code>class Post {
 constructor (id, title) {
  this.id = id;
  this.title = title;
 }
 toString() {
  return this.title;
 }
}

class Article extends Post {
 constructor (id, title, content) {
   super(id, title);
   this.content = content;
 }
}

class Link extends Post {
 constructor (id, title, url) {
  super(id, title);
  this.url = url;
 }
 toString() {
  return super.toString() + ' (' + this.url + ')';
 }
}
article = new Article(1, 'Hello, World!',
 'This is my first article.'
);
link = new Link(2, 'The Example', 'http://example.com');
// article instanceof Post === true
// link instanceof Post === true</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>9. Class properties</b>
<pre style="margin: 0px; padding: 5px;">
<code>class Post {
 constructor (id, title) {
  this.id = id;
  this.title = title;
  this._slug = '';
 }

 set slug(value) {
  this._slug = value;
 }

 get slug() {
  return this._slug;
 }
}

post = new Post(1, 'Hello, World!');
post.slug = 'hello-world';
console.log(post.slug);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>10. Liste - tous les éléments vrais</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [1, 2, 3];
all_truthy = items.every(Boolean);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>11. Liste - au moins un élément vrai</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3];
some_truthy = items.some(Boolean);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>12. Liste - itérer sur tous les éléments</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = ['a', 'b', 'c', 'd'];
items.forEach(function(element, index) {
 console.log(`${index}: ${element};`);
});</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>13. Liste - Map</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3];
all_doubled = items.map(
 x => 2 * x
);
// [0, 2, 4, 6]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>14. Liste - Filtrer les éléments avec une fonction</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [0, 1, 2, 3];
only_even = items.filter(
 x => x % 2 === 0
);
// [0, 2]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>15. Liste - Reduce avec une fonction</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [1, 2, 3, 4];

total = items.reduce(
 (total, current) => total + current
);

// 10
</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>16. Fusionner des dicts</b>
<pre style="margin: 0px; padding: 5px;">
<code>d1 = {a: 'A', b: 'B'}
d2 = {a: 'AAA', c: 'CCC'} 
merged = {...d1, ...d2};
// {a: 'AAA', b: 'B', c: 'CCC'}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>17. Parse int</b>
<pre style="margin: 0px; padding: 5px;">
<code>number = parseInt(text, 10);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>18. One liner/ Opérateur ternaire</b>
<pre style="margin: 0px; padding: 5px;">
<code>value = age >= 18? 'ADULT': 'CHILD';</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>19. Object attribute</b>
<pre style="margin: 0px; padding: 5px;">
<code>attribute = 'color';
value = obj[attribute] || 'GREEN';
obj[attribute] = value;</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>20. Dictionnaire value by key</b>
<pre style="margin: 0px; padding: 5px;">
<code>key = 'color';
value = dictionary[key] || 'GREEN'; 
dictionary[key] = value;</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>21. Slice</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = [1, 2, 3, 4, 5];
first_two = items.slice(0, 2); 
// [1, 2] 
last_two = items.slice(-2); 
// [4, 5] 
middle_three = items.slice(1, 4); 
// [2, 3, 4]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>22. Opération sur les listes</b>
<pre style="margin: 0px; padding: 5px;">
<code>items1 = ['A'];
items2 = ['B'];
items = items1.concat(items2); 
items.push('C'); 
items.unshift('D');
first = items.shift();
last = items.pop(); 
items.splice(0, 1);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>23. Joining lists of strings</b>
<pre style="margin: 0px; padding: 5px;">
<code>items = ['A', 'B', 'C'];
text = items.join(', '); // 'A, B, C'</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>24. JSON</b>
<pre style="margin: 0px; padding: 5px;">
<code>
json_data = JSON.stringify(dictionary, null, 4);
dictionary = JSON.parse(json_data);</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>25. Error handling</b>
<pre style="margin: 0px; padding: 5px;">
<code>function CustomException(message) {
  this.message = message;
  this.toString = function() {
    return this.message;
  }
}

function proceed() {
  throw new CustomException('Error happened!');
}

try {
 proceed();
} catch (err) {
 if (err instanceof CustomException) {
   console.log('Sorry! ' + err);
 }
} finally {
 console.log('Finishing');
}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>26. Import</b>
<pre style="margin: 0px; padding: 5px;">
<code>import math from math;
console.log(math.log(42));

import { log } from math;
console.log(log(42));

import * from math;
console.log(log(42));</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>27. Range</b>
<pre style="margin: 0px; padding: 5px;">
<code>console.log(Array.from(new Array(5), (x,i) => i));</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>28. Comprehensions</b>
<pre style="margin: 0px; padding: 5px;">
<code>//To double check with Babel
let names = [for (c of friends) if (c.friendly) c.name]</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>29. Dict creation</b>
<pre style="margin: 0px; padding: 5px;">
<code>let x = 42, y = 43
let mon_dict = {x, y}</code>
</pre>
    </div>
    <!-- -->
    <!-- -->
    <div style="width:100%; padding-top: 20px;">
      <b>30. String in list</b>
<pre style="margin: 0px; padding: 5px;">
<code>let my_list = ["titi", "tata", toto"];
if (my_list.includes('toto')) {
    console.log("ok");
}</code>
</pre>
    </div>
    <!-- -->
  </div>

</div>
</div>



