/* eslint-disable max-len */
import 'colors'

export default {
  CREATE_IN_PROGRESS                 : 'CREATE_IN_PROGRESS'.yellow,
  CREATE_FAILED                      : 'CREATE_FAILED'.red,
  CREATE_COMPLETE                    : 'CREATE_COMPLETE'.green,
  DELETE_IN_PROGRESS                 : 'DELETE_IN_PROGRESS'.yellow,
  DELETE_FAILED                      : 'DELETE_FAILED'.red,
  DELETE_COMPLETE                    : 'DELETE_COMPLETE'.grey,
  DELETE_SKIPPED                     : 'DELETE_SKIPPED'.red,
  UPDATE_IN_PROGRESS                 : 'UPDATE_IN_PROGRESS'.yellow,
  UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS'
      .yellow,
  UPDATE_FAILED                               : 'UPDATE_FAILED'.red,
  UPDATE_COMPLETE                             : 'UPDATE_COMPLETE'.green,
  ROLLBACK_IN_PROGRESS                        : 'ROLLBACK_IN_PROGRESS'.red,
  ROLLBACK_COMPLETE                           : 'ROLLBACK_COMPLETE'.red,
  ROLLBACK_FAILED                             : 'ROLLBACK_FAILED'.red,
  UPDATE_ROLLBACK_COMPLETE                    : 'UPDATE_ROLLBACK_COMPLETE'.gray,
  UPDATE_ROLLBACK_FAILED                      : 'UPDATE_ROLLBACK_FAILED'.red,
  UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: 'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS'
      .yellow,
  UPDATE_ROLLBACK_IN_PROGRESS: 'UPDATE_ROLLBACK_IN_PROGRESS'.yellow,
}
