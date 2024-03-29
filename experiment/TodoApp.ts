import { MirrorDB, Schema } from "../src/MirrorDB/MirrorDB";
import * as SchemaTypes from "src/MirrorDB/Schema";

type Todo = {
  id: string;
  checked: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  subList: Todo[];
  reminder?: Reminder;
};

type Reminder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  time: Date[];
};

SchemaTypes.Schema;

const newSchema = SchemaTypes.schema({
  todo: {
    checked: SchemaTypes.boolean(),
    description: SchemaTypes.string(),
    subList: SchemaTypes.many(SchemaTypes.entity("todo")),
    reminder: SchemaTypes.entity("reminder").optional(),
  },
  reminder: {
    time: SchemaTypes.datetime(),
  },
  "*": {
    createdAt: SchemaTypes.datetime().auto(),
    updatedAt: SchemaTypes.datetime().auto(),
  },
});

const schema: Schema = {
  todo: {
    checked: MirrorDB.boolean,
    description: MirrorDB.string,
    subList: MirrorDB.many(MirrorDB.entity("todo")),
    reminder: MirrorDB.entity("reminder"),
  },
  reminder: {
    time: MirrorDB.datetime,
  },
  "*": {
    id: MirrorDB.id,
    createdAt: MirrorDB.datetime,
    updatedAt: MirrorDB.datetime,
  },
};

export class App {
  private db: MirrorDB;

  constructor() {
    this.db = new MirrorDB("todo", schema);
  }

  public view(): Todo[] {
    return this.db.query<Todo>({
      find: {
        todo: {
          checked: true,
          description: "*",
          reminder: {
            time: "*",
          },
        },
      },
      sortBy: {
        createdAt: "asc",
      },
      limit: 10,
    });
  }

  // find [t? r? t?]: [t? :todo/checked true] [t? :todo/description d?] [t? reminder r?] [r? time ?t]
  // [[1 todo/checked true, 1 todo/descrption "blblbla", 1 reminder 2, 2 reminder/time "123"]]

  public add(todo: Todo): App {
    this.db.transact((tx) => {
      const reminderRef = todo.reminder
        ? tx.add(newSchema.reminder, {
            time: todo.reminder.time.toString(),
          })
        : undefined;

      tx.add(newSchema.todo, {
        checked: todo.checked,
        description: todo.description,
        reminder: reminderRef,
      });
      return tx;
    });
    return this;
  }

  public modify(todo: Todo): App {
    this.db.transact((tx) => {
      tx.update("todo", {
        find: {
          id: todo.id,
        },
        update: {
          checked: todo.checked,
          description: todo.description,
        },
      });
      if (todo.reminder) {
        tx.update("reminder", {
          find: {
            id: todo.reminder.id,
          },
          update: {
            time: todo.reminder.time.toString(),
          },
        });
      }
      return tx;
    });
    return this;
  }

  expand(todo: Todo, subList: Todo[]): App {
    this.db.transact((tx) => {
      const subListRefs = [];
      for (const subItem of subList) {
        const ref = tx.add(newSchema.todo, {
          checked: subItem.checked,
          description: subItem.description,
        });
        subListRefs.push(ref);
      }

      tx.update("todo", {
        find: {
          id: todo.id,
        },
        update: {
          subList: subListRefs.toString(),
        },
      });

      return tx;
    });

    return this;
  }
}
