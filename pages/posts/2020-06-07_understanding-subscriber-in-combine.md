---
title: Understanding Subscriber in Combine by re-implementing Sink
date: 2020-06-07
---

# Understanding Subscriber in Combine by re-implementing Sink

When we started learning Combine, the very first tutorial might be like this:
```
var subscriptions = Set<AnyCancellable>()
let publisher = [1, 2, 3, 4].publisher

publisher
    .sink(receiveCompletion: { print("Received completion: \($0)") },
         receiveValue: { print("Received value: \($0)") })
    .store(in: &subscriptions)
```

This will print the following in the console:
```
Received value: 1
Received value: 2
Received value: 3
Received value: 4
Received comletion: finished
```

What `.sink` method returns is an instance of type `AnyCancellable`, which in turn is a wrapper of an instance of type `Sink`.

`Sink` together with `Assign` are built-in subscribers of Combine framework. In Apple’s documentation, `Sink` is “A simple subscriber that requests an unlimited number of values upon subscription.” In this post, we’ll try to re-implement the `Sink`, and we name it `MySink`.

First,  it is a subscriber so it must conform to `Subscriber` protocol:
```
final class MySink<Input, Failure>: Subscriber where Failure: Error {
    func receive(subscription: Subscription) {
        subscription.request(.unlimited)
    }
    
    func receive(_ input: Input) -> Subscribers.Demand {
        print("Received value: \(input)")
        return .none
    }
    
    func receive(completion: Subscribers.Completion<Failure>) {
        print("Completion: \(completion)")
    }
}
```

In `receive(subscription:)` method we request an unlimited number of values as its definition. This is the initial request. In `receive(_ input:)` method we return any kind of `Demand` since the demand is additive.

Let’s put it on test:
```
let publisher = [1, 2, 3, 4].publisher
let mySink1 = MySink<Int, Never>()
publisher.subscribe(mySink1)
```

This will print the same as the above example:
```
Received value: 1
Received value: 2
Received value: 3
Received value: 4
Received completion: finished
```

Next we’ll implement the `mySink` method on `Publisher` so it works like built-in `sink` method.
```
extension Publisher {
    func mySink() -> AnyCancellable {
        let sink = MySink<Output, Failure>()
        subscribe(sink)
        return AnyCancellable(sink)
    }
}
```

It will not compile with error `Initializer ‘init(_:)’ requires that ‘MySink<Self.Output, Self.Failure>’ conform to ‘Cancellable’`. We make it conform to `Cancellable` with an only required method named `cancel`:
```
final class MySink<Input, Failure>: Subscriber, Cancellable where Failure : Error {
    func cancel() {}
}
```

Run test again:
```
Received value: 1
Received value: 2
Received value: 3
Received value: 4
Received completion: finished
```

Let’s try another:
```
let subject = PassthroughSubject<String, Never>()
let mySink2 = subject.mySink()
mySink2.store(in: &subscriptions)

subject.send("A")
subject.send("B")

// We cancel the subcription here
mySink2.cancel()
subject.send("C")
```

The console prints:
```
Received value: A
Received value: B
Received value: C
```

Something’s wrong! We keep getting value emitted by `subject` even we canceled it.  When we call `cancel` on the `mySink2` it has to notify the Publisher it subscribed to that it no longer wants to receive any value. To do that we need to keep a reference for the subscription when Publisher gives it to us.
```
final class MySink<Input, Failure>: Subscriber, Cancellable where Failure : Error {
    private var subscription: Subscription?

      // ...
    func receive(subscription: Subscription) {
        self.subscription = subscription
        subscription.request(.unlimited)
    }

    func cancel() {
        subscription?.cancel()
        subscription = nil
    }
}
```

Run code again:
```
Received value: A
Received value: B
```

It’s almost done now.  However, whenever we get the emitted values or completion event, we just print it out. We should allow the subscriber can do anything with those events. Update class `MySink` as follow, as noted that we should put it in the `Subscribers` namespace:
```
final class MySink<Input, Failure>: Subscriber, Cancellable where Failure : Error {
    private let receiveCompletion: (Subscribers.Completion<Failure>) -> Void
    private let receiveValue: (Input) -> Void
    private var subscription: Subscription?
    
    init(receiveCompletion: @escaping ((Subscribers.Completion<Failure>) -> Void),
         receiveValue: @escaping ((Input) -> Void)) {
        self.receiveValue = receiveValue
        self.receiveCompletion = receiveCompletion
    }

func receive(_ input: Input) -> Subscribers.Demand {
        receiveValue(input)
        return .none
    }
    
    func receive(completion: Subscribers.Completion<Failure>) {
        receiveCompletion(completion)
        subscription = nil
    }
}
```

We need to update method `mySink` as well:
```
func mySink(receiveCompletion: @escaping (Subscribers.Completion<Failure>) -> Void, receiveValue: @escaping (Output) -> Void) -> AnyCancellable {
    let sink = MySink<Output, Failure>(
        receiveCompletion: receiveCompletion,
        receiveValue: receiveValue)
        
    subscribe(sink)
    return AnyCancellable(sink)
}
```

So that’s it. We complete reimplementing the `Sink` and `sink` of Combine. Sure the actual implementation is more complicated but it works for our learning purpose. All source code can be found [here](https://github.com/Thieurom/my-swift-playgrounds/tree/master/001-my-sink).