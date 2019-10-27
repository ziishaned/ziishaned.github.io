---
title: Package Management in Go for NPM users
comments: true
---

## Introduction

- Similar to `npm init` you have `go mod init`
- This will create `go.mod` which:
	- Has all the dependencies and their respective versions listed in it
	- Sort of `package.json` and `package-lock.json` combined in one file

## Installing a Dependency
Similar to `npm install` you have `go get url@version`.

- **Installing a git tag** — `go get github.com/go-chi/chi@v4`
- **Installing a branch** — `go get github.com/go-chi/chi@@master`
- **Installing a commit hash** — `go get github.com/go-chi/chi@@aac20cc`

After installing a dependency, if you look at the `go.mod` file, you might see some of the dependencies listed as
```bash
github.com/go-chi/chi@v4.0.1+incompatible // indirect
```

* `+incompatible` here either means that the package has not opted to use the go modules yet or it violates some versioning guidelines
* `// indirect` means that the package has been installed but isn't used anywhere in the project yet or it will also be listed in front of the indirect dependencies of the packages that have not opted to use go modules yet.

When you install a package, you might see that it created `go.sum` file in the repository which contains the cryptographic checksums of the packages installed which is used for validation purposes.

## Caching the dependencies

Running `go mod download` will download all the dependencies and cache them locally which could make CI faster.

## Removing unused packages

- Similar to `npm prune`, you have `go mod tidy`
- Running `go mod tidy` will remove all the unused packages or remove `// indirect` from the modules that are being used
- Also it can install any required dependencies depending upon the combinations of OS, architecture and build tags

## Updating Package Versions

- Run `go get -u` to update the minor package versions
- Run `go get -u=patch` to update the patch versions
- Major versions have to be updated manually in the `go.mod` file

## Substituing Imported Modules

Point a required module to your own fork or even local file path using replace directive:

```bash
go mod edit -replace github.com/go-chi/chi=./packages/chi
```

Remove the replacement

```bash
go mod edit -dropreplace github.com/go-chi/chi
```