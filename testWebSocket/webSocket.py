import asyncio
import json
import random
import websockets
import math

# topic -> set of connected websockets
subscriptions = {}

async def handler(websocket):
    # Each client can subscribe to multiple topics; we store their active topics
    # to cleanly unsubscribe on disconnect.
    client_topics = set()

    try:
        async for message in websocket:
            print(message)
            try:
                data = json.loads(message)
                action = data.get("action")
                topic = data.get("topic")

                if action == "subscribe":
                    if topic not in subscriptions:
                        subscriptions[topic] = set()
                    subscriptions[topic].add(websocket)
                    client_topics.add(topic)

                elif action == "unsubscribe":
                    if topic in subscriptions:
                        subscriptions[topic].discard(websocket)
                        if not subscriptions[topic]:
                            del subscriptions[topic]
                    client_topics.discard(topic)

                else:
                    await websocket.send(json.dumps({
                        "error": "Unknown action"
                    }))

            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    "error": "Invalid JSON"
                }))

    finally:
        # Clean up this client's subscriptions on disconnect
        for topic in list(client_topics):
            if topic in subscriptions:
                subscriptions[topic].discard(websocket)
                if not subscriptions[topic]:
                    del subscriptions[topic]


async def periodic_publisher(func, topic: str, dt: float = 1):
    count = 0
    while True:
        #print(topic)
        await asyncio.sleep(dt)
        if topic in subscriptions:
            
            message = json.dumps({
                "topic": topic,
                "payload": func(dt, count)
            })
            
            for subscriber in list(subscriptions[topic]):
                try:
                    await subscriber.send(message)
                    count += 1
                    print(f"Send {topic}: {count}")
                except websockets.exceptions.ConnectionClosed:
                    subscriptions[topic].discard(subscriber)
                    
            if not subscriptions[topic]:
                del subscriptions[topic]

def get_widget(dt, *a, **k):
    with open('text1.json', "r", encoding="UTF-8") as f:
        t = json.load(f)
    return t
    

def get_chart(dt, *a, **k):
    with open('chart1.json', "r", encoding="UTF-8") as f:
        t = json.load(f)
    return t

def get_random(dt, *a, **k):
    return random.random()
    
    
def get_random2(dt, *a, **k):
    mi, ma = -10, 20
    return round(random.random() * (ma - mi) + mi, 2)
    
def get_sin(dt, *a, **k):
    return math.sin(a[0] * 0.01)
    
def get_count(dt, count, *a, **k):
    return count


async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("Topic-based WebSocket server running on ws://localhost:8765")
        
        asyncio.create_task(periodic_publisher(get_widget, 'text1'))
        asyncio.create_task(periodic_publisher(get_chart, 'chart1'))
        asyncio.create_task(periodic_publisher(get_random, 'random'))
        asyncio.create_task(periodic_publisher(get_random2, 'random2'))
        asyncio.create_task(periodic_publisher(get_sin, 'sin'))
        asyncio.create_task(periodic_publisher(get_count, 'count'))

        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())