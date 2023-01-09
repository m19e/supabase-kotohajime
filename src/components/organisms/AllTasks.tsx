import {
  AllTasksComponent,
  OrderByDirection,
  UpdateTasksComponent,
} from "@/gql"
import type { AllTasksQuery } from "@/gql"

export const AllTasks = () => {
  return (
    <AllTasksComponent
      variables={{
        orderBy: [
          {
            created_at: OrderByDirection.DescNullsFirst,
          },
        ],
      }}
    >
      {({ data, fetching }) => {
        if (fetching) return <div>Loading...</div>
        return <TaskList data={data} />
      }}
    </AllTasksComponent>
  )
}

interface ListProps {
  data: AllTasksQuery | undefined
}

const TaskList = ({ data }: ListProps) => {
  if (!data) return null
  const { edges } = data.tasksCollection!

  return (
    <div className="overflow-y-auto grow min-h-0">
      {edges.map(({ node: task }) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}

interface ItemProps {
  task: {
    title: string
    is_completed: boolean
    id: any
  }
}

const TaskItem = ({ task }: ItemProps) => {
  return (
    <div key={task.id} className="flex p-1 text-lg">
      <div className="grow">{task.title}</div>
      <UpdateTasksComponent>
        {({ executeMutation }) => (
          <button
            onClick={() =>
              executeMutation({
                set: {
                  is_completed: !task.is_completed,
                },
                filter: {
                  id: {
                    eq: task.id,
                  },
                },
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 ${
                task.is_completed ? "stroke-green-500" : "stroke-gray-500"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </UpdateTasksComponent>
    </div>
  )
}
