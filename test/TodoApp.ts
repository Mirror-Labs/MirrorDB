
type Todo = {
  id: string,
  checked: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  subList: Todo[];
  reminder?: Reminder;
}

type Reminder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  time: Date[];
}

const schema = {
  'todo': {
    'checked': MirrorDB.boolean,
    'description': MirrorDB.string,
    'subList': MirrorDB.many(MirrorDB.entity('todo')),
    'reminder': MirrorDB.entity('reminder').optional
  },
  'reminder': {
    'time': MirrorDB.datetime
  },
  '*': {
    'id': MirrorDB.id.auto,
    'createdAt': MirrorDB.datetime.auto,
    'updatedAt': MirrorDB.datetime.auto,
  }
};

export class App {
  private db: MirrorDB;

  constructor() {
    this.db = new MirrorDB('todo', schema);
  }

  public view(): Todo[] {
    return this.db.query({ 
      find: {
        'todo': {
          'checked': true,
          'description': '*',
          'reminder': {
            'time': '*'
          }
        }
      },
      sortBy: {
        'createdAt': 'asc'
      },
      limit: 10
     });
  }

  // find [t? r? t?]: [t? :todo/checked true] [t? :todo/description d?] [t? reminder r?] [r? time ?t]
  // [[1 todo/checked true, 1 todo/descrption "blblbla", 1 reminder 2, 2 reminder/time "123"]]

  public add(todo: Todo): App {
    this.db.transaction((tx) => {
      const reminderRef = todo.reminder ? tx.add('reminder', {
        time: todo.reminder
      }) : undefined 
    
      tx.add('todo', {
        checked: todo.checked,
        description: todo.description,
        reminder: reminderRef
      })
      return tx;
    });
    return this;
  }

  public modify(todo: Todo): App {
    this.db.transaction((tx) => {
      tx.update('todo', {
        find: {
          'id': todo.id,
        },
        update: {
          'checked': todo.checked,
          'description': todo.description,
        }
      });
      if (todo.reminder) {
        tx.update('reminder', {
          find: {
            'id': todo.reminder.id,
          },
          update: {
            'time': todo.reminder.time,
          }
        });
      }
      return tx;
    });
    return this;
  }

  expand(todo: Todo, subList: Todo[]): App {
    this.db.transaction((tx) => {
      const subListRefs = [];
      for (const subItem of subList) {
        const ref = tx.add('todo', {
          checked: todo.checked,
          description: todo.description,
        });
        subListRefs.push(ref);
      }

      tx.update('todo', {
        find: {
          'id': todo.id,
        },
        update: {
          'subList': subListRefs
        }
      })

      return tx;
    });

    return this;
  }
}
