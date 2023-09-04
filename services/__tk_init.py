import tkinter as tk


def toggle(button: tk.Button, b):
    if button.config('relief')[-1] == 'sunken':
        button.config(text="ON", relief="raised", fg="GREEN")
        b.set(True)
    else:
        button.config(text="OFF", relief="sunken", fg="RED")
        b.set(False)


def callback(input):
    if input.isdigit() or not input:
        return True
    else:
        return False


def cap_score(event):
    var_P = event.widget.get()
    if var_P:
        event.widget.delete(0, tk.END)
        if int(var_P) > 100:
            event.widget.insert(0, 100)
        else:
            event.widget.insert(0, int(var_P))


def submit(c, l, m):
    global target
    if c.get() and l.get() and m.get():
        target = [int(c.get()), int(l.get()), int(m.get())]
        root.destroy()


def tk_init():
    global root
    root = tk.Tk()
    reg = root.register(callback)
    root.bind_all("<1>", lambda event: event.widget.focus_set())
    root.title("Puni Options")

    cratable_only = tk.BooleanVar()
    cratable_only.set(True)
    best_only = tk.BooleanVar()
    best_only.set(True)
    ordered = tk.BooleanVar()
    ordered.set(False)

    cratable_only_Frame = tk.Frame()
    tk.Label(master=cratable_only_Frame,
             text="Duplicable only? ").grid(column=0, row=0)
    cratable_only_Button = tk.Button(master=cratable_only_Frame, text="ON", relief="raised", fg='GREEN',
                                     command=lambda: toggle(cratable_only_Button, cratable_only))
    cratable_only_Button.grid(column=1, row=0)
    cratable_only_Frame.pack()

    best_only_Frame = tk.Frame()
    tk.Label(master=best_only_Frame,
             text="Max only? ").grid(column=0, row=0)
    best_only_Button = tk.Button(master=best_only_Frame, text="ON", relief="raised", fg='GREEN',
                                 command=lambda: toggle(best_only_Button, best_only))
    best_only_Button.grid(column=1, row=0)
    best_only_Frame.pack()

    score_Frame = tk.Frame()

    const_Frame = tk.Frame(master=score_Frame)
    const_Frame.grid(column=0, row=0)
    tk.Label(master=const_Frame, text="Const.").pack()
    const = tk.Entry(master=const_Frame, width=3,
                     validate="key", validatecommand=(reg, '%P'))
    const.insert(tk.END, 100)
    const.bind('<FocusOut>', cap_score)
    const.pack()

    luster_Frame = tk.Frame(master=score_Frame)
    luster_Frame.grid(column=1, row=0)
    tk.Label(master=luster_Frame, text="Luster").pack()
    luster = tk.Entry(master=luster_Frame, width=3,
                      validate="key", validatecommand=(reg, '%P'))
    luster.insert(tk.END, 94)
    luster.bind('<FocusOut>', cap_score)
    luster.pack()

    mood_Frame = tk.Frame(master=score_Frame)
    mood_Frame.grid(column=2, row=0)
    tk.Label(master=mood_Frame, text="Mood").pack()
    mood = tk.Entry(master=mood_Frame, width=3, validate="key",
                    validatecommand=(reg, '%P'))
    mood.insert(tk.END, 100)
    mood.bind('<FocusOut>', cap_score)
    mood.pack()

    score_Frame.pack()

    ordered_Frame = tk.Frame()
    tk.Label(master=ordered_Frame,
             text="Need to be ordered? ").grid(column=0, row=0)
    ordered_Button = tk.Button(master=ordered_Frame, text="OFF", relief="sunken", fg='RED',
                               command=lambda: toggle(ordered_Button, ordered))
    ordered_Button.grid(column=1, row=0)
    ordered_Frame.pack()

    submit_Button = tk.Button(
        text="Submit", command=lambda: submit(const, luster, mood))
    submit_Button.pack()

    #root.bind_all("<ButtonRelease-1>", lambda event: print(cratable_only.get(), best_only.get(), ordered.get()))
    root.mainloop()

    return (target, (cratable_only.get(), best_only.get(), ordered.get()))


if __name__ == "__main__":
    tk_init()
