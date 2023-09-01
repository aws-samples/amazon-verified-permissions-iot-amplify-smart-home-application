
//
const POLICY_STORE_ID = "SyedPolicyStore"
// avp = boto3.client("verifiedpermissions")
//
// def entity(entity_type: str, entity_id: Union[str, int]) -> dict:
//     return {"entityType": f"SmartHome::{entity_type}", "entityId": str(entity_id)}
//
// def attributes(**kwargs) -> dict:
//     return {key: attribute_value(value) for key, value in kwargs.items()}
//
// def attribute_value(value: any) -> dict:
//     if isinstance(value, str):
//         return {"string": value}
//     elif isinstance(value, set) or isinstance(value, list):
//         return {"set": [attribute_value(v) for v in value]}
//     elif isinstance(value, dict):
//         return {"entityIdentifier": value}
//     else:
//         raise f"Unknown attribute value type: {type(value)}"
//
// def permissions_check(avp_principal: str, action: str, resource: str) -> bool:
//     args = {
//         "policyStoreId": POLICY_STORE_ID,
//         "principal": entity("User", "syed"),
//         "action": {"actionType": "Action", "actionId": "SetTemperature"},
//         "resource": entity("Device", "Thermostat1"),
//     }
//
//     args["entities"] = {
//         "entityList": [
//                 {
//                     "identifier": entity("Device", "Thermostat1"),
//                     "attributes": attributes(
//                         primaryOwner=entity("User", "syed"),
//                     ),
//                 }
//             ]
//         }
//     debug_object(args)
//     resp = avp.is_authorized(**args)
//     return resp["decision"]

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

const permissionsCheck = (avpPrincipal, action, resource) => {
    let args = {
        "policyStoreId": "PolicyStoreId",
        "principal": entity("User", "syed"),
        "action": {"actionType": "Action", "actionId": "SetTemperature"}
    }
}
