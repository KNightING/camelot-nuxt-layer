export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<PartialRecursive<U>>
    : T[P] extends object
      ? PartialRecursive<T[P]>
      : T[P];
}

/**
 * 比較出差異的物件
 * 用於 RESTful Patch 進行差份更新
 * ! Array型別只要有一個差異或者長度不同就整組替換
 * ! 因為依newObj的KEY為主，所以oldObj有的KEY, 但在newObj不存在, 不會當成需要更新的項目
 * ! 主要是提供RESTful Patch為使用, 這種疑似刪除的情況，在RESTful上請使用Delete
 *
 * @param oldObj - 原物件
 * @param newObj - 新物件
 *
 */
const diff = <T>(oldObj: T, newObj: T): PartialRecursive<T> => {
  const result: PartialRecursive<T> = {}

  for (const key in newObj) {
    const oldValue = oldObj[key]
    const newValue = newObj[key]

    if (typeof oldValue === 'undefined') {
      result[key] = newValue as any
      continue
    }

    if (Array.isArray(newValue) && Array.isArray(oldValue)) {
      if (newValue.length !== oldValue.length) {
        result[key] = newValue as any
        continue
      }

      for (let i = 0; i < newValue.length; i++) {
        const arrayOldValue = oldValue[i]
        const arrayNewValue = newValue[i]

        const diffResult = isObjectDiff(arrayOldValue, arrayNewValue)
        if (diffResult) {
          // ! 只要有一個不一樣，就整筆個Array替換
          result[key] = newValue as any
        }
      }
      continue
    }

    const diffResult = isObjectDiff(oldValue, newValue)
    if (diffResult) {
      if (diffResult === true) {
        result[key] = newValue as any
      } else {
        result[key] = diffResult as any
      }
    }
  }

  return result
}

const isObjectDiff = (
  oldValue: any,
  newValue: any,
): boolean | PartialRecursive<any> => {
  if (newValue !== null && typeof newValue === 'object') {
    if (isDate(oldValue) && isDate(newValue)) {
      if (oldValue.getTime() !== newValue.getTime()) {
        return true
      } else {
        return false
      }
    }

    const innerDiff = diff(oldValue, newValue)
    if (Object.keys(innerDiff).length > 0) {
      return innerDiff
    }
    return false
  }

  if (oldValue !== newValue) {
    return true
  }
  return false
}

const isDate = (val: any): val is Date => {
  // https://stackoverflow.com/a/643827/15380305
  // Object.prototype.toString.call(val) === '[object Date]'
  return val instanceof Date
}

const deepClone = <T>(source: T): T => {
  if (source == null || typeof source !== 'object') {
    return source
  }

  if (isDate(source)) {
    const copy = new Date()
    copy.setTime(source.getTime())
    return copy as T
  }

  if (Array.isArray(source)) {
    const copy = []
    for (let i = 0, len = source.length; i < len; i++) {
      copy[i] = deepClone(source[i])
    }
    return copy as T
  }

  if (source instanceof Object) {
    const copy = {} as T
    for (const key in source) {
      copy[key] = deepClone(source[key])
    }
    return copy as T
  }

  throw new Error('Unable to copy obj! Its type isn\'t supported.')
}

const isUndefined = (obj: any) => {
  return typeof obj === 'undefined'
}

const isNotUndefined = (obj: any) => !isUndefined(obj)

export const useObject = () => {
  return { diff, isDate, deepClone, isUndefined, isNotUndefined }
}

// const timestamp1 = 1616608200000; // example timestamp
// const date1 = new Date(timestamp1);

// const timestamp2 = 1616608200000; // example timestamp
// const date2 = new Date(timestamp2);

// type User = {
//   name: string;
//   isMale: boolean;
//   address: {
//     country: string;
//     city?: string;
//     road?: {
//       name?: string;
//       number?: string;
//       a?: Array<any>;
//     };
//   };
//   a?: Array<any>;
//   date?: Date;
// };

// const user1: User = {
//   name: "John",
//   isMale: true,
//   address: {
//     country: "USA",
//     city: "New York",
//     road: {
//       name: "忠孝東路",
//       a: [0, 2, new Date(timestamp1)],
//     },
//   },
//   a: [
//     1,
//     2,
//     3,
//     {
//       name: "John",
//     },
//   ],
//   date: date1,
// };

// const user2: User = {
//   name: "Jane",
//   isMale: false,
//   address: {
//     country: "USA",
//     city: "New York",
//     road: {
//       name: "忠孝東路2",
//       a: [0, 2, new Date(timestamp1)],
//     },
//   },
//   a: [
//     1,
//     2,
//     3,
//     {
//       name: "John",
//     },
//   ],
//   date: date2,
// };

// const diffs = useObject().diff(user1, user2);

// console.log(diffs);

// const clone = useObject().deepClone(user1);

// console.log(clone);
// console.log(clone === user1);
// console.log(clone.address === user1.address);
// console.log(clone.date?.getTime() === user1.date?.getTime());
// console.log(clone.isMale === user1.isMale);
// console.log(clone.a === user1.a);

// const diffs2 = useObject().diff(user1, clone);
// console.log(diffs2);
