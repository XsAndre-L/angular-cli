/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { logging } from '@angular-devkit/core';
import { existsSync } from 'fs';
import { join } from 'path';
import { releasePackages } from '../lib/packages';

export default async function (_options: {}, logger: logging.Logger) {
  let error = false;

  for (const pkg of releasePackages) {
    // There should be at least one BUILD file next to each package.json.
    if (!existsSync(join(pkg.root, 'BUILD')) && !existsSync(join(pkg.root, 'BUILD.bazel'))) {
      logger.error(
        `The package ${JSON.stringify(pkg.name)} does not have a BUILD file associated to it.\n` +
          'You must either set an exception or make sure it can be built using Bazel.',
      );
      error = true;
    }
  }

  // TODO: enable this to break
  if (error) {
    // process.exit(1);
    logger.warn('Found some BUILD files missing, which will be breaking your PR soon.');
  }

  return 0;
}
