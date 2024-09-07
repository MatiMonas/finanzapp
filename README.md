# FinanazAPI

TODO: build instructions to start the project, roadmap, docs, etc

## Docker

```
sudo docker-compose up --build
```

```
docker exec -it finanzapp /bin/sh
```

```
npx prisma generate
```

---

## Usecases

### Budgets and Monthly Wages

1. User has to manually create a Budget Configuration or select a preexistent one.
2. The selected Budget Configuration will be assigned to the user, after which the User will have to insert his/her monthly salary, which will assign the percentage to each Budget, showing the corresponding total for each one.
