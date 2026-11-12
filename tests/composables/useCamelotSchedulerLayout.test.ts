import { describe, expect, it } from 'vitest'

const makeEvent = (id: number, start: Date, end: Date): CamelotSchedulerEvent => ({
  id,
  title: `事件 ${id}`,
  start,
  end,
})

describe('useCamelotSchedulerLayout.snapMinutes', () => {
  const { snapMinutes } = useCamelotSchedulerLayout()

  it('吸附到最近的倍數', () => {
    expect(snapMinutes(7, 15)).toBe(0)
    expect(snapMinutes(8, 15)).toBe(15)
    expect(snapMinutes(22, 15)).toBe(15)
    expect(snapMinutes(23, 15)).toBe(30)
  })
})

describe('useCamelotSchedulerLayout.layoutColumns', () => {
  const { layoutColumns } = useCamelotSchedulerLayout()

  it('不重疊的區間各自一欄', () => {
    const layout = layoutColumns([
      {
        key: 1,
        start: 0,
        end: 60,
      },
      {
        key: 2,
        start: 60,
        end: 120,
      },
    ])
    expect(layout).toEqual([
      {
        key: 1,
        column: 0,
        columns: 1,
      },
      {
        key: 2,
        column: 0,
        columns: 1,
      },
    ])
  })

  it('重疊的區間並排，同一組共用欄數', () => {
    const layout = layoutColumns([
      {
        key: 1,
        start: 0,
        end: 120,
      },
      {
        key: 2,
        start: 30,
        end: 90,
      },
    ])
    expect(layout.find(item => item.key === 1)).toMatchObject({
      column: 0,
      columns: 2,
    })
    expect(layout.find(item => item.key === 2)).toMatchObject({
      column: 1,
      columns: 2,
    })
  })

  it('同一組裡後面的區間會重用已經空出來的欄', () => {
    const layout = layoutColumns([
      {
        key: 1,
        start: 0,
        end: 60,
      },
      {
        key: 2,
        start: 0,
        end: 180,
      },
      {
        key: 3,
        start: 90,
        end: 150,
      },
    ])
    // 2 比 1 長，起點相同時長的先排；3 在 1 結束後重用 1 讓出的欄
    expect(layout.find(item => item.key === 2)).toMatchObject({
      column: 0,
      columns: 2,
    })
    expect(layout.find(item => item.key === 1)).toMatchObject({
      column: 1,
      columns: 2,
    })
    expect(layout.find(item => item.key === 3)).toMatchObject({
      column: 1,
      columns: 2,
    })
  })

  it('彼此不連續重疊的兩組各算各的欄數', () => {
    const layout = layoutColumns([
      {
        key: 1,
        start: 0,
        end: 60,
      },
      {
        key: 2,
        start: 30,
        end: 90,
      },
      {
        key: 3,
        start: 200,
        end: 260,
      },
    ])
    expect(layout.find(item => item.key === 3)).toMatchObject({
      column: 0,
      columns: 1,
    })
    expect(layout.find(item => item.key === 1)?.columns).toBe(2)
  })

  it('空陣列回傳空陣列', () => {
    expect(layoutColumns([])).toEqual([])
  })
})

describe('useCamelotSchedulerLayout.eventsOnDay / rangeInDay', () => {
  const {
    eventsOnDay, rangeInDay,
  } = useCamelotSchedulerLayout()
  const day = new Date(2026, 10, 12)

  it('只回傳與當天有交集的事件', () => {
    const inside = makeEvent(1, new Date(2026, 10, 12, 9), new Date(2026, 10, 12, 10))
    const before = makeEvent(2, new Date(2026, 10, 11, 9), new Date(2026, 10, 11, 10))
    const after = makeEvent(3, new Date(2026, 10, 13, 0), new Date(2026, 10, 13, 1))
    expect(eventsOnDay([inside, before, after], day)).toEqual([inside])
  })

  it('剛好在午夜結束的事件不算進隔天', () => {
    const endsAtMidnight = makeEvent(1, new Date(2026, 10, 11, 22), new Date(2026, 10, 12, 0))
    expect(eventsOnDay([endsAtMidnight], day)).toEqual([])
  })

  it('跨日事件在兩天都有交集，區間裁到當天', () => {
    const overnight = makeEvent(1, new Date(2026, 10, 11, 22), new Date(2026, 10, 12, 2))
    expect(eventsOnDay([overnight], day)).toEqual([overnight])
    expect(rangeInDay(overnight, day)).toEqual({
      start: 0,
      end: 120,
    })
    expect(rangeInDay(overnight, new Date(2026, 10, 11))).toEqual({
      start: 22 * 60,
      end: 1440,
    })
  })
})

describe('useCamelotSchedulerLayout 日期格', () => {
  const {
    buildMonthGrid, buildWeekDays,
  } = useCamelotSchedulerLayout()

  it('月格是 42 天，從包含月初的那一週開始', () => {
    // 2026-11-01 是週日
    const sundayStart = buildMonthGrid(new Date(2026, 10, 15), 0)
    expect(sundayStart).toHaveLength(42)
    expect(sundayStart[0]).toEqual(new Date(2026, 10, 1))
    const mondayStart = buildMonthGrid(new Date(2026, 10, 15), 1)
    expect(mondayStart[0]).toEqual(new Date(2026, 9, 26))
  })

  it('一週是 7 天，依週起始日對齊', () => {
    const week = buildWeekDays(new Date(2026, 10, 12), 1)
    expect(week).toHaveLength(7)
    expect(week[0]).toEqual(new Date(2026, 10, 9))
    expect(week[6]).toEqual(new Date(2026, 10, 15))
  })
})

describe('useCamelotSchedulerLayout.shiftEvent', () => {
  const { shiftEvent } = useCamelotSchedulerLayout()
  const event = makeEvent(1, new Date(2026, 10, 12, 9, 0), new Date(2026, 10, 12, 10, 30))

  it('平移後長度不變', () => {
    const moved = shiftEvent(event, 1, 45)
    expect(moved.start).toEqual(new Date(2026, 10, 13, 9, 45))
    expect(moved.end).toEqual(new Date(2026, 10, 13, 11, 15))
  })

  it('可以往前平移，並跨過月底', () => {
    const moved = shiftEvent(event, -12, -60)
    // 11/12 往前 12 天是 10/31，再往前 60 分鐘是 8:00
    expect(moved.start).toEqual(new Date(2026, 9, 31, 8, 0))
  })

  it('有傳人員才換人員，沒傳就保留原本的', () => {
    const owned = {
      ...event,
      resourceId: 'a',
    }
    expect(shiftEvent(owned, 0, 0).resourceId).toBe('a')
    expect(shiftEvent(owned, 0, 0, 'b').resourceId).toBe('b')
  })

  it('不改動原本的事件', () => {
    shiftEvent(event, 3, 30)
    expect(event.start).toEqual(new Date(2026, 10, 12, 9, 0))
  })
})

describe('useCamelotSchedulerLayout.resizeEventEnd / rangeBetween', () => {
  const {
    resizeEventEnd, rangeBetween,
  } = useCamelotSchedulerLayout()
  const event = makeEvent(1, new Date(2026, 10, 12, 9, 0), new Date(2026, 10, 12, 10, 0))

  it('調整結束時間', () => {
    expect(resizeEventEnd(event, new Date(2026, 10, 12, 12, 0), 15).end).toEqual(new Date(2026, 10, 12, 12, 0))
  })

  it('結束時間不能早於起點加最短長度', () => {
    expect(resizeEventEnd(event, new Date(2026, 10, 12, 8, 0), 15).end).toEqual(new Date(2026, 10, 12, 9, 15))
  })

  it('兩個端點由早到晚排序', () => {
    const range = rangeBetween(new Date(2026, 10, 12, 11, 0), new Date(2026, 10, 12, 9, 0), 15)
    expect(range.start).toEqual(new Date(2026, 10, 12, 9, 0))
    expect(range.end).toEqual(new Date(2026, 10, 12, 11, 0))
  })

  it('兩個端點相同時，長度至少一個吸附單位', () => {
    const point = new Date(2026, 10, 12, 9, 0)
    expect(rangeBetween(point, point, 30).end).toEqual(new Date(2026, 10, 12, 9, 30))
  })
})

describe('useCamelotSchedulerLayout.nearestRectIndex', () => {
  const { nearestRectIndex } = useCamelotSchedulerLayout()
  const rects = [
    {
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    },
    {
      left: 100,
      top: 0,
      right: 200,
      bottom: 100,
    },
    {
      left: 0,
      top: 100,
      right: 100,
      bottom: 200,
    },
  ]

  it('指標在格子內就是那一格', () => {
    expect(nearestRectIndex(rects, 150, 50)).toBe(1)
    expect(nearestRectIndex(rects, 50, 150)).toBe(2)
  })

  it('指標在所有格子外時取距離最近的', () => {
    expect(nearestRectIndex(rects, 500, 50)).toBe(1)
    expect(nearestRectIndex(rects, -40, 400)).toBe(2)
  })

  it('略過還沒量到的格子，全部都沒有時回傳 -1', () => {
    expect(nearestRectIndex([undefined, rects[1]], 10, 10)).toBe(1)
    expect(nearestRectIndex([undefined], 10, 10)).toBe(-1)
    expect(nearestRectIndex([], 10, 10)).toBe(-1)
  })
})
