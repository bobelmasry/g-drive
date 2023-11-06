import keyboard

while True:
    # Wait for the next event.
    event = keyboard.read_event()
    if event.event_type == keyboard.KEY_DOWN and event.name == 'w':
        print('w was pressed')
    elif event.event_type == keyboard.KEY_DOWN and event.name == 'a':
        print('a was pressed')
    elif event.event_type == keyboard.KEY_DOWN and event.name == 's':
        print('s was pressed')
    elif event.event_type == keyboard.KEY_DOWN and event.name == 'd':
        print('d was pressed')
    else: pass

