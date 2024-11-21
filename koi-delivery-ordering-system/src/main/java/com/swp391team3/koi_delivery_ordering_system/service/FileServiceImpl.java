package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.File;
import com.swp391team3.koi_delivery_ordering_system.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements IFileService {
    private final FileRepository fileRepository;
    @Value("${file.upload-dir}")
    private String folderPath;

    @Override
    public File uploadFileToFileSystem(MultipartFile file) throws IOException {
        String uuid = String.valueOf(UUID.randomUUID());
        String fileName = uuid + "-" + file.getOriginalFilename();
        String filePath = folderPath + fileName;
        File fileData = getFile(file, filePath, uuid);

        fileRepository.save(fileData);

        file.transferTo(new java.io.File(filePath));

        return fileData;
    }

    private File getFile(MultipartFile file, String filePath, String uuid) {
        Date currentDate = new Date();
        File fileData = new File();

        fileData.setName(uuid + "-" + file.getOriginalFilename());
        fileData.setCreatedTime(currentDate);
        fileData.setType(file.getContentType());
        fileData.setFilePath(filePath);
        return fileData;
    }

    @Override
    public byte[] getFileFromFileSystem(Long id) throws IOException {
        Optional<File> fileData = fileRepository.findById(id);
        String filePath = fileData.get().getFilePath();
        byte[] images = Files.readAllBytes(new java.io.File(filePath).toPath());
        return images;
    }

    @Override
    public String updateFileInFileSystem(Long id, MultipartFile newFile) throws IOException {
        Optional<File> fileData = fileRepository.findById(id);
        if (fileData.isPresent()) {
            String fileName = UUID.randomUUID() + "-" + newFile.getOriginalFilename();

            String filePath = folderPath + fileName;

            File file = fileData.get();
            String oldFilePath = file.getFilePath();

            java.io.File oldFile = new java.io.File(oldFilePath);
            if (oldFile.exists()) {
                oldFile.delete();
            }

            file.setName(newFile.getOriginalFilename());
            file.setType(newFile.getContentType());
            file.setFilePath(filePath);

            newFile.transferTo(new java.io.File(folderPath + newFile.getOriginalFilename()));
            fileRepository.save(file);

            return "file modified successfully : " + filePath;
        }
        return null;
    }

//    @Override
//    public int getTotalFileInFileSystem() {
//        return fileRepository.getTotalImages();
//    }
//
//    @Override
//    public List<String> getDuplicatedFileInFileSystem() {
//        return fileRepository.getDuplicateImageName();
//    }

    @Override
    public boolean deleteFile(Long fileId) {
        Optional<File> fileData = fileRepository.findById(fileId);
        if (fileData.isPresent()) {
            File file = fileData.get();
            String oldFilePath = file.getFilePath();

            java.io.File oldFile = new java.io.File(oldFilePath);
            if (oldFile.exists()) {
                oldFile.delete();
                return true;
            }
        }
        return false;
    }
}
