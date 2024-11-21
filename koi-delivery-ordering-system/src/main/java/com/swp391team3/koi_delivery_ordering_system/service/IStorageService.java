package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.Storage;
import com.swp391team3.koi_delivery_ordering_system.requestDto.StorageRequestCreationDTO;
import com.swp391team3.koi_delivery_ordering_system.responseDto.StorageResponseDTO;

import java.util.List;
import java.util.Optional;

public interface IStorageService {
    Storage createStorage(StorageRequestCreationDTO request);
//    Storage updateStorage(StorageRequestCreationDTO request, Long storageId);
//    boolean deleteStorage(StorageRequestCreationDTO request);
    List<Storage> getAllStorages();

    List<StorageResponseDTO> getAllStoragesWithOrderQuantity();

    Optional<Storage> getStorageById(Long id);
}
