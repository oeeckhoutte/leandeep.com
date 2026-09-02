# Dependency Injection in Python

- Canonical URL: https://leandeep.com/dependency-injection-in-python/
- Author: Olivier Eeckhoutte
- Published: 2019-06-12T19:28:00Z
- Updated: 2019-06-12T19:28:00Z
- Language: fr
- Tags: Python, Tests, Design Patterns
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

There are many articles available online that talk about dependency injection (DI) in Python. 
Most of them suggest complexe methods for something that can be finally very easy to do using the built-in Python mechanisms.

Working with dependency injection is a good thing since it makes your code more testable and decoupled.

To implement dependency injection we are going to use the `super` method. Super calls the next dependency in the **[Method Resolution Order](https://en.wikipedia.org/wiki/C3_linearization)**.

<br/>

## Example

Let's say I am developing an (kind of) autonomous surveillance camera composed of a RC car with a camera on top of it. 

I have the following class to steer my car:

*Create a file autonomous_surveillance_car.py*
```
class Car(object):
    """
    Class that can drive a RCC car
    """

    def turn_on(self):
        print("Starting car...")

    def move_forward(self):
        print("Going forward...")

    def move_backward(self):
        print("Going backward...")

    def turn_right(self):
        print("Turning right...")

    def turn_left(self):
        print("Turning left...")


class AutonomousCar(Car):
    """
    Automates the car directions to spy the house
    """

    def spy(self, times=10):
        super().turn_on()
        for i in range(times):
            super().move_forward()
            super().turn_right()
            super().move_forward()
            super().turn_right()
            super().move_forward()
            super().turn_right()
            super().move_forward()
            super().turn_right()
            # sleep x minutes


if __name__ == '__main__':
    auto_car = AutonomousCar()
    auto_car.spy()

```

Now I want to write tests for my autonomous car class car but I don't want that my car starts going forward. This can be dangerous. I want to use a Mock. But I don't want to modify the `AutonomousCar(Car)` line and replace the `Car` dependency with something like `MockCar` when I want to execute my tests.

The solution is to use a dependency injection:

*Create a file called test_autonomous_surveillance_car.py*
```
import unittest
from autonomous_surveillance_car import AutonomousCar, Car


class MockCar(Car):
    """
    Simulates a read RC car by recording tasks
    """

    def __init__(self):
        self.tasks = []

    def turn_on(self):
        self.tasks.append("Turning on car")

    def move_forward(self):
        self.tasks.append("Going forward")

    def move_backward(self):
        self.tasks.append("Going backward")

    def turn_right(self):
        self.tasks.append("Turning right")

    def turn_left(self):
        self.tasks.append("Turning left")


class MockedAutonomousCar(AutonomousCar, MockCar):
    """
    Inject a mock car into the car dependency
    """


class TestAutonomousCar(unittest.TestCase):

    def test_spy(self):
        mocked_auto_car = MockedAutonomousCar()
        mocked_auto_car.spy()
        expected = (["Turning on car"] +
                    ["Going forward", "Turning right"] * 40)
        self.assertEqual(mocked_auto_car.tasks, expected)


if __name__ == "__main__":
    unittest.main()

```

Now execute the test:

```
python -i test_autonomous_surveillance_car.py
```

Result:

```
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

In the prompt type `help(MockedAutonomousCar)`.

You will see the Method Resolution Order (the dependencies order used when `super` is called) of the `MockedAutonomousCar` Class:

```
Help on class MockedAutonomousCar in module __main__:

class MockedAutonomousCar(autonomous_surveillance_car.AutonomousCar, MockCar)
 |  Inject a mock car into the car dependency
 |
 |  Method resolution order:
 |      MockedAutonomousCar
 |      autonomous_surveillance_car.AutonomousCar
 |      MockCar
 |      autonomous_surveillance_car.Car
 |      builtins.object
 |

...

```

<br/>

## Conclusion

We see that our `MockedAutonomousCar` class uses depends on `autonomous_surveillance_car.AutonomousCar` class that depends on `MockCar` class. It does not depends on the `Car` class and we did not change our codebase. Moreover the implementation was very easy and just took 1 line of code.

