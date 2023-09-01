//
import {VerifiedPermissionsClient, IsAuthorizedCommand} from "@aws-sdk/client-verifiedpermissions"; // ES Modules import

const client = new VerifiedPermissionsClient();

const entity = (entityType, entityId) => {
    return {entityType: `SmartHome::${entityType}`, entityId}
}

function attributeValue(value) {
    if (typeof value === 'string') {
        return {"string": value};
    } else if (Array.isArray(value) || value instanceof Set) {
        return {"set": Array.from(value).map(v => attributeValue(v))};
    } else if (typeof value === 'object' && value !== null) {
        return {"entityIdentifier": value};
    } else {
        throw new Error(`Unknown attribute value type: ${typeof value}`);
    }
}

function attributes(...kwargs) {
    const argsObject = Object.assign({}, ...kwargs);
    return Object.entries(argsObject).reduce((acc, [key, value]) => {
        acc[key] = attributeValue(value);
        return acc;
    }, {});
}

export const permissionsCheck = (avpPrincipal, action, resource, policyStoreId) => {

    let args = {
        policyStoreId,
        "principal": entity("User", "syed"),
        "action": {"actionType": "", "actionId": ""}
    }

    const command = new IsAuthorizedCommand(args);
    client.send(command)
        .then(
            response => {
                return response.decision
            }
        )
        .catch(e => {
            console.log("Unable to decode JSON coming from Shadow Update call");
        });
}

