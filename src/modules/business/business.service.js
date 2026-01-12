import Business from "../../models/business/business.model.js";

export const createBusiness = async (data, superAdminId) => {
  const business = await Business.create({
    ...data,
    createdBy: superAdminId,
  });

  return business;
};

export const getBusinessById = async (businessId) => {
    const business = await Business.findById(businessId);
    if(!business) throw new Error("Business not found");
    return business;
}

// export const getAllBusinesses = async () => {
//     const businesses = await Business.find();
//     return businesses;
// }

export const getAllBusinesses = async ({
  offset = 0,
  limit = 10,
  search = ""
} = {}) => {
  const skip = Number(offset);
  const take = Number(limit);

  const query = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

  const [businesses, total] = await Promise.all([
    Business.find(query)
      .skip(skip)
      .limit(take)
      .sort({ createdAt: -1 }),
    Business.countDocuments(query)
  ]);

  return {
    data: businesses,
    pagination: {
      total,
      offset: skip,
      limit: take,
      hasMore: skip + take < total
    }
  };
};

export const updateBusiness = async (businessId, data) => {
    const business = await Business.findByIdAndUpdate(businessId, data)
    if(!business) throw new Error("Business not found");
    return business;
}

export const deleteBusiness = async (businessModel) => {
    await Business.findByIdAndDelete(businessModel);
    return true;
}

export const createSubscription = async (businessId, data) => {
  const business = await Business.findById(businessId);
  if (!business) throw new Error("Business not found");

  business.subscription = {
    plan: data.plan,
    expiresAt: data.expiresAt,
    tokenLimit: data.tokenLimit,
  };

  await business.save();
  return business.subscription;
};

export const updateSubscription = async (businessId, data) => {
  const business = await Business.findById(businessId);
  if (!business) throw new Error("Business not found");

  business.subscription = {
    ...business.subscription,
    ...data,
  };

  await business.save();
  return business.subscription;
};

export const deleteSubscription = async (businessId) => {
  const business = await Business.findById(businessId);
  if (!business) throw new Error("Business not found");

  business.subscription = null;
  await business.save();

  return true;
};

export const getSubscription = async (businessId) => {
  const business = await Business.findById(businessId).select("subscription");
  if (!business) throw new Error("Business not found");

  return business.subscription;
};
