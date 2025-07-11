// Test file for complexity analysis
function simpleFunction(x) {
    return x + 1;
}

function complexFunction(data, options) {
    if (!data) {
        return null;
    }

    let result = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'user') {
            if (options.includeActive) {
                if (data[i].status === 'active') {
                    if (data[i].permissions) {
                        for (let j = 0; j < data[i].permissions.length; j++) {
                            if (data[i].permissions[j] === 'admin') {
                                result.push({
                                    ...data[i],
                                    isAdmin: true
                                });
                            } else if (data[i].permissions[j] === 'editor') {
                                result.push({
                                    ...data[i],
                                    isEditor: true
                                });
                            } else {
                                result.push(data[i]);
                            }
                        }
                    } else {
                        result.push(data[i]);
                    }
                }
            } else {
                result.push(data[i]);
            }
        } else if (data[i].type === 'guest') {
            if (options.includeGuests) {
                result.push(data[i]);
            }
        }
    }

    return result;
}

// Another complex function with switch statements
function processUserAction(action, user, context) {
    switch (action.type) {
        case 'CREATE':
            if (user.permissions.includes('create')) {
                if (context.environment === 'production') {
                    if (action.requiresApproval) {
                        return submitForApproval(action, user);
                    } else {
                        return executeAction(action);
                    }
                } else {
                    return executeAction(action);
                }
            } else {
                throw new Error('Insufficient permissions');
            }
        case 'UPDATE':
            if (user.permissions.includes('update')) {
                if (
                    action.targetId === user.id ||
                    user.permissions.includes('admin')
                ) {
                    return executeAction(action);
                } else {
                    throw new Error('Cannot update other users');
                }
            }
            break;
        case 'DELETE':
            if (user.permissions.includes('delete')) {
                if (context.environment === 'production') {
                    if (user.permissions.includes('admin')) {
                        return executeAction(action);
                    } else {
                        throw new Error('Delete requires admin in production');
                    }
                } else {
                    return executeAction(action);
                }
            }
            break;
        default:
            throw new Error('Unknown action type');
    }
}
