package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.File;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

public interface IFileService {
    File uploadFileToFileSystem(MultipartFile file) throws IOException;
    byte[] getFileFromFileSystem(Long id) throws IOException;
    String updateFileInFileSystem(Long id, MultipartFile newFile) throws IOException;
//    int getTotalFileInFileSystem();
//    List<String> getDuplicatedFileInFileSystem();
    boolean deleteFile(Long fileId);
}
