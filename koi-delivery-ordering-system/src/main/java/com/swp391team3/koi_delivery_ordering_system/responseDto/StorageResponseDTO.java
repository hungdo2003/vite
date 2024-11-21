package com.swp391team3.koi_delivery_ordering_system.responseDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StorageResponseDTO {
    private Long storageId;
    private String storageName;
    private String storageAddress;
    private int orderCount;

    public StorageResponseDTO(Long storageId, String storageName, String storageAddress, int orderCount) {
        this.storageId = storageId;
        this.storageName = storageName;
        this.storageAddress = storageAddress;
        this.orderCount = orderCount;
    }
}
