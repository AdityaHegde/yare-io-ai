import {TaskType} from "./Task";
import {BasicChargeTask} from "./BasicChargeTask";
import {BasicDischargeTask} from "./BasicDischargeTask";
import {RallyTask} from "./RallyTask";

export type TasksMapType = {
  [TaskType.Charge]: BasicChargeTask,
  [TaskType.Store]: BasicDischargeTask,
  [TaskType.BaseDefend]: BasicDischargeTask,
  [TaskType.Rally]: RallyTask,
  [TaskType.BaseAttack]: RallyTask,
}
