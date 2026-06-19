-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entry" REAL NOT NULL,
    "takeProfit" REAL NOT NULL,
    "stopLoss" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lotSize" REAL NOT NULL DEFAULT 1,
    "closePrice" REAL,
    "profit" REAL,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("createdAt", "entry", "id", "status", "stopLoss", "symbol", "takeProfit", "type", "userId") SELECT "createdAt", "entry", "id", "status", "stopLoss", "symbol", "takeProfit", "type", "userId" FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
