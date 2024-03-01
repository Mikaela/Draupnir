// Copyright 2022-2024 Gnuxie <Gnuxie@protonmail.com>
// Copyright 2019 2021 The Matrix.org Foundation C.I.C.
//
// SPDX-License-Identifier: AFL-3.0 AND Apache-2.0
//
// SPDX-FileAttributionText: <text>
// This modified file incorporates work from mjolnir
// https://github.com/matrix-org/mjolnir
// </text>

import { ActionError, ActionException, ActionResult, DescriptionMeta, MatrixRoomReference, RoomSetResult, StringRoomID, isOk } from "matrix-protection-suite";
import { DocumentNode } from "../commands/interface-manager/DeadDocument";
import { JSXFactory } from "../commands/interface-manager/JSXFactory";
import { renderRoomPill } from "../commands/interface-manager/MatrixHelpRenderer";

export function renderElaborationTrail(error: ActionError): DocumentNode {
    return <details><summary>Elaboration trail</summary>
    <ul>
        {error.getElaborations().map((elaboration) => <li><pre>{elaboration}</pre></li>)}
    </ul>
    </details>
}

export function renderDetailsNotice(error: ActionError): DocumentNode {
    if (!(error instanceof ActionException)) {
        return <fragment></fragment>
    }
    return <p>
        Details can be found by providing the reference <code>{error.uuid}</code>
        to an administrator.
    </p>
}

export function renderExceptionTrail(error: ActionError): DocumentNode {
    if (!(error instanceof ActionException)) {
        return <fragment></fragment>
    } if (!(error.exception instanceof Error)) {
        return <fragment></fragment>
    }
    return <details><summary>Stack Trace for: <code>{error.exception.name}</code></summary>
        <pre>{error.exception.toString()}</pre>
    </details>
}

export function renderFailedSingularConsequence(
    description: DescriptionMeta,
    error: ActionError
): DocumentNode {
    return <fragment>
        <details>
            <summary><code>{description.name}</code>: {error.mostRelevantElaboration}</summary>
            {renderDetailsNotice(error)}
            {renderElaborationTrail(error)}
            {renderExceptionTrail(error)}
        </details>
    </fragment>
}

function renderRoomOutcomeOk(roomID: StringRoomID): DocumentNode {
    return <span>{renderRoomPill(MatrixRoomReference.fromRoomID(roomID))} - OK</span>
}
function renderRoomOutcomeError(roomID: StringRoomID, error: ActionError): DocumentNode {
    return <fragment>
        <details>
            <summary>{renderRoomPill(MatrixRoomReference.fromRoomID(roomID))} - Error: {error.mostRelevantElaboration}</summary>
            {renderDetailsNotice(error)}
            {renderElaborationTrail(error)}
            {renderExceptionTrail(error)}
        </details>
    </fragment>
}

export function renderRoomOutcome(roomID: StringRoomID, result: ActionResult<unknown>): DocumentNode {
    if (isOk(result)) {
        return renderRoomOutcomeOk(roomID);
    } else {
        return renderRoomOutcomeError(roomID, result.error);
    }
}

export function renderRoomSetResult(roomResults: RoomSetResult, { summary }: { summary: DocumentNode }): DocumentNode {
    return <details>
        <summary>{summary}</summary>
        <ul>{[...roomResults.map.entries()].map(([roomID, outcome]) => {
        return <li>{renderRoomOutcome(roomID, outcome)}</li>
    })}</ul>
    </details>
}
