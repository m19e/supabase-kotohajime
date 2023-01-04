import { createClient } from "@supabase/supabase-js"
import { gql } from "urql"

export const SUPABASE_URL = process.env.NEXT_LOCAL_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_LOCAL_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const ALL_TASKS = /* GraphQL */ gql(`
  query allTasks($orderBy: [tasksOrderBy!]) {
    tasksCollection(orderBy: $orderBy) {
      edges {
        node {
          title
          is_completed
          id
        }
      }
    }
  }
`)

export const INSERT_TASKS = /* GraphQL */ gql(`
  mutation insertTasks($objects: [tasksInsertInput!]!) {
    insertIntotasksCollection(objects: $objects) {
      records {
        title
      }
    }
  }
`)

export const UPDATE_TASKS = /* GraphQL */ gql(`
  mutation updateTasks($set: tasksUpdateInput!, $filter: tasksFilter) {
    updatetasksCollection(set: $set, filter: $filter) {
      records {
        is_completed
      }
    }
  }
`)
