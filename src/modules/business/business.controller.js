import * as BusinessService from "./business.service.js";

export const createBusiness = async (req, res) => {
  try {
    const business = await BusinessService.createBusiness(
      req.body,
      req.params.id
    );
    res.status(201).json({ success: true, business });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const business = await BusinessService.getBusinessById(req.params.id);
    res.json({ success: true, business });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await BusinessService.getAllBusinesses();
    res.json({ success: true, businesses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const business = await BusinessService.updateBusiness(
      req.params.id,
      req.body
    );
    res.json({ success: true, business });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    await BusinessService.deleteBusiness(req.params.id);
    res.json({ success: true, message: "Business deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const subscription = await BusinessService.createSubscription(
      req.params.id,
      req.body
    );
    res.status(201).json({ success: true, subscription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const subscription = await BusinessService.updateSubscription(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, subscription });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    await BusinessService.deleteSubscription(req.params.id);
    res.json({ success: true, message: "Subscription removed" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const subscription = await BusinessService.getSubscription(req.params.id);
    res.json({ success: true, subscription });
  } catch (err) {
    res.status(400).json({ success: false, message: error.message });
  }
};
