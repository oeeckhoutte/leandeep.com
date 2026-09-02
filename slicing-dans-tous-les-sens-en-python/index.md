# Slicing dans tous les sens en Python

- Canonical URL: https://leandeep.com/slicing-dans-tous-les-sens-en-python/
- Author: Olivier Eeckhoutte
- Published: 2017-02-04T21:16:00Z
- Updated: 2017-02-04T21:16:00Z
- Language: fr
- Tags: Python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici quelques exemples d'utilisation de *slicing* en Python. 
Cela fonctionne très bien sur les `list`, `str` et `bytes`.
On peut ajouter du *slicing* sur des classes qui implémentent `__getitem__` et `__setitem__` *magic methods*.

```
a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print('First four: ', a[:4])
print('Last four:  ', a[-4:])
print('Middle two: ', a[3:-3])
# First four:  ['a', 'b', 'c', 'd']
# Last four:   ['e', 'f', 'g', 'h']
# Middle two:  ['d', 'e']
```

```
# When slicing from the start of a list, you should leave out the zero index
# to reduce visual noise.


assert a[:5] == a[0:5]


# When slicing to the end of a list, you should leave out the final index
# because it's redundant.


assert a[5:] == a[5:len(a)]
```

```
# Using negative numbers for slicing is helpful for doing offsets relative
# to the end of a list. All of these forms of slicing would be clear to a new
# reader of your code. There are no surprises, and I encourage you to use
# these variations.


print(a[:])
print(a[:5])
print(a[:-1])
print(a[4:])
print(a[-3:])
print(a[2:5])
print(a[2:-1])
print(a[-3:-1])
# ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
# ['a', 'b', 'c', 'd', 'e']
# ['a', 'b', 'c', 'd', 'e', 'f', 'g']
# ['e', 'f', 'g', 'h']
# ['f', 'g', 'h']
# ['c', 'd', 'e']
# ['c', 'd', 'e', 'f', 'g']
# ['f', 'g']
```

```
# Slicing deals properly with start and end indexes that are beyond the
# boundaries of the list. That makes it easy for your code to establish
# a maximum length to consider for an input sequence.


first_twenty_items = a[:20]
last_twenty_items = a[-20:]
print(first_twenty_items)
print(last_twenty_items)
# ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
# ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

# In contrast, accessing the same index directly causes an exception.
# print(a[20])
# IndexError: list index out of range


# Note
# Beware that indexing a list by a negative variable is one of the few
# situations in which you can get surprising results from slicing. For
# example, the expression somelist[-n:] will work fine when n is greater
# than one (e.g. somelist[-3:]). However, when n is zero, the expression
# somelist[-0:] will result in a copy of the original list.
```

```
# The result of slicing a list is a whole new list. References to the objects
# from the original list are maintained. Modifying the result of slicing won't
# affect the original list.

b = a[4:]
print('Before:    ', b)
b[1] = 99
print('After:     ', b)
print('No change: ', a)
# Before:     ['e', 'f', 'g', 'h']
# After:      ['e', 99, 'g', 'h']
# No change:  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
```

```
# When used in assignments, slices will replace the specified range in the
# original list. Unlike tuple assignments (like a, b = c[:2), the length of
# slice assignments don't need to be the same. The values before and after
# the assigned slice will be preserved. The list will grow or shrink to
# accommodate the new values.

print('Before: ', a)
a[2:7] = [99, 22, 14]
print('After:  ', a)
# Before:  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
# After:   ['a', 'b', 99, 22, 14, 'h']
```

```
# If you leave out both the start and the end indexes when slicing, you'll end
# up with a copy of the original list.

b = a[:]
assert b == a and b is not a
```

```
# if you assign a slice with no start or end indexes, you'll replace its
# entire contents with a copy of what's referenced (instead of allocating a
# new list).


b = a
print('Before: ', a)
a[:] = [101, 102, 103]
assert a is b
print('After:  ', a)
# Before:  ['a', 'b', 99, 22, 14, 'h']
# After:   [101, 102, 103]
```

```
# In addition to basic slicing (see Item 5: Knowing how to slice sequences),
# Python has special syntax for the stride of a slice in the form
# somelist[start:end:stride]. This lets you take every n-th item when slicing
# a sequence. For example, the stride makes it easy to group by even and odd
# indexes in a list.

a = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
odds = a[::2]
evens = a[1::2]
print(odds)
print(evens)
# ['red', 'yellow', 'blue']
# ['orange', 'green', 'purple']
```

```
# The problem is that the stride syntax ofter cause unexpected behavior that
# can introduce bugs. For example, a common Python trick for reversing a byte
# string is to slice the string with a stride of -1.


x = b'mongoose'
y = x[::-1]
print(y)
# b'esoognom'
```

```
# That works well for byte strings and ASCII characters, but it will break for
# Unicode characters encoded as UTF-8 byte strings.


w = '谢谢谢谢'
# x = w.enocde('utf-8')
# y = x[::-1]
# z = y.decode('utf-8')
# print(y)
# print(z)
# AttributeError: 'str' object has no attribute 'enocde'
```

```
# Are negative strides besides -1 useful? Consider the following examples.


a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
print(a[::2])
print(a[::-2])
# ['a', 'c', 'e', 'g']
# ['h', 'f', 'd', 'b']
```

```
# Here, ::2 means select every second item starting at the beginning.
# Trickier, ::-2 means select every second item starting at the end and moving
# backwards.


# What do you think 2::2 means? What about -2::-2 vs. -2:2:-2 vs. 2:2:-2?
print(a[2::2])
print(a[-2::-2])
print(a[-2:2:-2])
print(a[2:2:-2])
# ['c', 'e', 'g']
# ['g', 'e', 'c', 'a']
# ['g', 'e']
# []


# The point is that the stride part of the slicing syntax can be extremely
# confusing. Having three numbers within the brackets is hard enough to read
# because of its density. Then it's not obvious when the start and end indexes
# come into effect relative to the stride value, especially when stride is
# negative.


# To prevent problems, avoid using stride along with start and end indexes. If
# you must use a stride, prefer making it a positive value and omit start and
# end indexes. If you must use stride with start and end indexes, consider
# using one assignment to stride and another to slice.


b = a[::2]
c = b[1:-1]
print(b)
print(c)
# ['a', 'c', 'e', 'g']
# ['c', 'e']
```

```
# Slicing and then striding will create an extra shallow copy of the data.
# The first operation should try to reduce the size of the resulting slice by
# as much as possible. If your program can't afford the time or memory
# required for two steps, consider using the itertools built-in module's
# islice method (see Item 46: Use built-in algorithms and data structures),
# which doesn't permit negative values for start, end or stride.
```

```
# Things to remember

# 1. Avoid being verbose: Don't supply 0 for the start index or the length of
#     the sequence for the end index.
# 2. Slicing is forgiving of start or end indexes that are out of bounds,
#     making it easy to express slices on the front or back boundaries of a
#     sequence (like a[:20] or a[-20:]).
# 3. Assigning to a list slice will replace that range in the original
#     sequence with what's referenced even if their lengths are different.
# 4. Specifying start, end, and stride in a slice can be extremely confusing.
# 5. Prefer using positive stride values in slices without start or end
#     indexes. Avoid negative stride values if possible.
# 6. Avoid using start, end and stride together in a single slice. If you need
#     all three parameters, consider doing two assignments (one to slice,
#     another to stride) or using islice form itertools built-in module.
```

Source: Livre "Effective Python: 59 Specific Ways to Write Better Python" par Brett Slatkin. Je vous recommande grandement de l'acheter et de le lire.

