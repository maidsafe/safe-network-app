# SAFE Network App

Desktop app for managing the your SAFE Network applications.

|                                                                Linux/OS X                                                                 | Windows | Issues |                                                Lines of Code                                                 |
| :---------------------------------------------------------------------------------------------------------------------------------------: | :-----: | :----: | :----------------------------------------------------------------------------------------------------------: |
| [![Build Status](https://travis-ci.com/maidsafe/safe_launchpad_app.svg?branch=master)](https://travis-ci.com/maidsafe/safe_launchpad_app) |         |        | [![LoC](https://tokei.rs/b1/github/maidsafe/safe-network-app)](https://github.com/maidsafe/safe-network-app) |

| [MaidSafe website](https://maidsafe.net) | [SAFE Dev Forum](https://forum.safedev.org) | [SAFE Network Forum](https://safenetforum.org) |
| :--------------------------------------: | :-----------------------------------------: | :--------------------------------------------: |


## Building

-   `git clone`
-   `yarn`
-   `yarn dev`

### Testing

-   `SNAPP_DRY_RUN=true yarn dev`

This will not write to the filesystem, but will log to the console what changes it would have made.

## Applications

Applications managed by the app are defined in a json file, `managedApplications.json`, and each app has a structure thus:

```
"SAFE Browser": {
    "name": "SAFE Browser",
    "repository": "https://github.com/joshuef/safe_browser",
    "latestVersion": "0.1.0",
    "type": "userApplications"
}
```

Note there's no `v` on the version, but one _is_ expected on the release tag.

## Releases

-   Fork the SAFE Network App repository
-   Clone repo locally or ensure the latest commit has been pulled if it is already cloned.
-   Before running yarn commands, remove the RC tags previously generated from both local and remote.
-   To install the dependencies run `yarn`.
-   Update the version number in the package.json.
-   We need to push these changes to origin repo, and ensure the changes are merged to master.
-   Run `yarn deploy` to release the packages.

## License

This SAFE Network library is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.

## Contribution

Copyrights in the SAFE Network are retained by their contributors. No copyright assignment is required to contribute to this project.
