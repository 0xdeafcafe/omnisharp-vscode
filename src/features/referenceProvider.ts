/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import AbstractSupport from './abstractProvider';
import * as protocol from '../protocol';
import * as serverUtils from '../omnisharpUtils';
import {createRequest, toLocation} from '../typeConvertion';
import {ReferenceProvider, Location, TextDocument, CancellationToken, Position} from 'vscode';

export default class OmnisharpReferenceProvider extends AbstractSupport implements ReferenceProvider {

	public provideReferences(document: TextDocument, position: Position, options: { includeDeclaration: boolean;}, token: CancellationToken): Promise<Location[]> {

		let req = createRequest<protocol.FindUsagesRequest>(document, position);
		req.OnlyThisFile = false;
		req.ExcludeDefinition = false;

		return serverUtils.findUsages(this._server, req, token).then(res => {
			if (res && Array.isArray(res.QuickFixes)) {
				return res.QuickFixes.map(toLocation);
			}
		});
	}
}
