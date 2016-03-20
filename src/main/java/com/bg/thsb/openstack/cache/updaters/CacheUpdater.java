package com.bg.thsb.openstack.cache.updaters;

import com.bg.thsb.infinispan.InfinispanCacheWrapper;
import org.infinispan.Cache;
import org.modelmapper.ModelMapper;

/**
 * CacheUpdater
 * Use ScheduledThreadPoolExecutor for scheduling threads
 * Run all updaters simultaneously
 *
 */
public abstract class CacheUpdater implements Runnable {

	Cache<String, Object> cache;
	ModelMapper modelMapper = new ModelMapper();
	CacheUpdater() {
		this.cache = InfinispanCacheWrapper.getCache();
	}

	@Override
	public abstract void run();
}