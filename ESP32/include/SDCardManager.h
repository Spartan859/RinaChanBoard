#ifndef SDCARD_MANAGER_H
#define SDCARD_MANAGER_H

#include "FS.h"
#include "SD.h"
#include "SPI.h"

class SDCardManager {
public:
    SDCardManager();
    void initialize();
    void listDir(const char *dirname, uint8_t levels);
    void createDir(const char *path);
    void removeDir(const char *path);
    void readFile(const char *path);
    void writeFile(const char *path, const char *message);
    void appendFile(const char *path, const char *message);
    void renameFile(const char *path1, const char *path2);
    void deleteFile(const char *path);
    void testFileIO(const char *path);

private:
    void printCardType(uint8_t cardType);
};

#endif // SDCARD_MANAGER_H
